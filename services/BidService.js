const { models, sequelize } = require("../models");
const { Op } = require("sequelize");
const { rankBids } = require("../utils/helpers");

class BidService {
  static async submitBid(agency, { requestId, price, duration, notes }, res) {
    if (price < 50) throw new Error("You must bid at least 50 credits");
    const request = await models.TravelRequest.findByPk(requestId);
    if (!request) throw new Error("Request not found");
    // Ensure agency has not already placed a bid on this request
    const existing = await models.Bid.findOne({
      where: { requestId, agencyId: agency.id },
    });
    if (existing) {
      return {
        data: existing,
        duplicate: true,
      };
    }

    const bid = await models.Bid.create({
      requestId,
      agencyId: agency.id,
      price,
      duration,
      notes,
      agencyName: agency.name,
      packageDetails: {
        ...request.toJSON(),
        agency,
        // duration,
        // notes,
      },
    });
    console.log("biddddd", bid);
    return bid;
  }

  static async getBids(requestId) {
    const travelRequest = await models.TravelRequest.findByPk(requestId);
    if (!travelRequest) return [];

    const bids = await models.Bid.findAll({
      where: { requestId },
      include: [
        { model: models.User, as: "Agency", attributes: ["name", "rating"] },
      ],
    });

    return rankBids(
      bids.map((bid) => ({
        ...bid.toJSON(),
        name: bid.Agency?.name,
        rating: bid.Agency?.rating,
      })),
      travelRequest.toJSON()
    );
  }

  static async getAgencyBids(requestId, agencyId) {
    const bids = await models.Bid.findAll({
      where: { requestId, agencyId },
      include: [
        { model: models.User, as: "Agency", attributes: ["name", "rating"] },
      ],
    });
    return bids.map((bid) => ({
      ...bid.toJSON(),
      packageDetails: bid.packageDetails || {},
    }));
  }

  static async acceptBid(bidId, userId, notifyUser) {
    const transaction = await sequelize.transaction();
    try {
      const bid = await models.Bid.findByPk(bidId, { transaction });
      if (!bid) throw new Error("Bid not found");

      const agency = await models.User.findByPk(bid.agencyId, { transaction });
      if (agency.credits < 1) throw new Error("Insufficient credits");

      await models.Bid.update(
        { status: "accepted" },
        { where: { id: bidId }, transaction }
      );

      await models.Bid.update(
        { status: "unselected" },
        {
          where: {
            requestId: bid.requestId,
            id: { [Op.ne]: bidId },
          },
          transaction,
        }
      );

      await models.TravelRequest.update(
        { status: "closed" },
        { where: { id: bid.requestId }, transaction }
      );

      await models.CreditTransaction.create(
        { agencyId: bid.agencyId, credits: 1, type: "deduct" },
        { transaction }
      );

      await models.User.update(
        { credits: agency.credits - 1 },
        { where: { id: bid.agencyId }, transaction }
      );

      notifyUser(userId, { message: "Bid accepted" });

      await transaction.commit();
      return bid;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }
}

module.exports = { BidService };

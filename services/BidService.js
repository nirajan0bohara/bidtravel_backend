const { models } = require('../models');
const { rankBids } = require('../utils/helpers');
const { Op } = require('sequelize');

class BidService {
  static async submitBid(agencyId, { requestId, price, packageDetails }) {
    const request = await models.TravelRequest.findByPk(requestId);
    if (!request) throw new Error('Travel request not found');
    
    const bid = await models.Bid.create({
      requestId,
      agencyId,
      price,
      packageDetails: JSON.stringify(packageDetails), // Store as JSON string
      status: 'pending',
      createdAt: new Date(),
    });
    
    return { bidId: bid.id, userId: request.userId };
  }

  static async getBids(requestId) {
    const bids = await models.Bid.findAll({
      where: { requestId },
      include: [{ model: models.User, as: 'User', attributes: ['name', 'rating'] }],
    });
    return rankBids(bids.map(bid => ({
      ...bid.toJSON(),
      name: bid.User.name,
      rating: bid.User.rating,
      packageDetails: JSON.parse(bid.packageDetails || '{}'),
    })));
  }

  static async getAgencyBids(requestId, agencyId) {
    const bids = await models.Bid.findAll({
      where: { requestId, agencyId },
      include: [{ model: models.User, as: 'User', attributes: ['name', 'rating'] }],
    });
    return bids.map(bid => ({
      ...bid.toJSON(),
      packageDetails: JSON.parse(bid.packageDetails || '{}'),
    }));
  }

  static async acceptBid(bidId, userId, notifyUser) {
    const transaction = await models.sequelize.transaction();
    try {
      const bid = await models.Bid.findByPk(bidId, {
        include: [{ model: models.TravelRequest }],
        transaction,
      });
      if (!bid) throw new Error('Bid not found');
      
      if (bid.TravelRequest.userId !== userId) {
        throw new Error('You are not authorized to accept this bid');
      }

      const agency = await models.User.findByPk(bid.agencyId, { transaction });
      if (!agency) throw new Error('Agency not found');
      if (agency.credits < 1) throw new Error('Insufficient credits');
      
      await models.Bid.update(
        { status: 'accepted' },
        { where: { id: bidId }, transaction }
      );
      
      await models.Bid.update(
        { status: 'unselected' },
        { where: { requestId: bid.requestId, id: { [Op.ne]: bidId } }, transaction }
      );
      
      await models.TravelRequest.update(
        { status: 'closed' },
        { where: { id: bid.requestId }, transaction }
      );
      
      await models.CreditTransaction.create(
        { agencyId: bid.agencyId, credits: 1, type: 'deduct' },
        { transaction }
      );
      
      await models.User.update(
        { credits: agency.credits - 1 },
        { where: { id: bid.agencyId }, transaction }
      );
      
      notifyUser(userId, { message: 'Bid accepted' });
      notifyUser(bid.agencyId, { message: 'Your bid was accepted' });
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = { BidService };
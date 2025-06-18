const { models } = require('../models');
const { rankBids } = require('../utils/helpers');

class BidService {
  static async submitBid(agencyId, { requestId, price, packageDetails }) {
    const request = await models.TravelRequest.findByPk(requestId);
    if (!request) throw new Error('Request not found');
    
    const bid = await models.Bid.create({
      requestId,
      agencyId,
      price,
      packageDetails
    });
    
    return { bidId: bid.id, userId: request.userId };
  }

  static async getBids(requestId) {
    const bids = await models.Bid.findAll({
      where: { requestId },
      include: [{ model: models.User, as: 'User', attributes: ['name', 'rating'] }]
    });
    return rankBids(bids.map(bid => ({
      ...bid.toJSON(),
      name: bid.User.name,
      rating: bid.User.rating
    })));
  }

  static async acceptBid(bidId, userId, notifyUser) {
    const transaction = await models.sequelize.transaction();
    try {
      const bid = await models.Bid.findByPk(bidId, { transaction });
      if (!bid) throw new Error('Bid not found');
      
      const agency = await models.User.findByPk(bid.agencyId, { transaction });
      if (agency.credits < 1) throw new Error('Insufficient credits');
      
      await models.Bid.update(
        { status: 'accepted' },
        { where: { id: bidId }, transaction }
      );
      
      await models.Bid.update(
        { status: 'unselected' },
        { where: { requestId: bid.requestId, id: { [models.Sequelize.Op.ne]: bidId } }, transaction }
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
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = { BidService };
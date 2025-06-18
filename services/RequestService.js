const { models } = require('../models');

class RequestService {
  static async createRequest(userId, { destination, startDate, travelers, preferences }) {
    const request = await models.TravelRequest.create({
      userId,
      destination,
      startDate,
      travelers,
      preferences
    });
    return request.id;
  }

  static async getUserRequests(userId) {
    return await models.TravelRequest.findAll({
      where: { userId }
    });
  }

  static async getRequestsByLocation(agencyId) {
    const agency = await models.User.findByPk(agencyId);
    return await models.TravelRequest.findAll({
      where: {
        status: 'open',
        destination: { [models.Sequelize.Op.like]: `%${agency.location}%` }
      }
    });
  }
}

module.exports = { RequestService };
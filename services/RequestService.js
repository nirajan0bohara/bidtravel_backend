const { models } = require('../models');

class RequestService {
  static async createRequest(userId, { from, destination, startDate, travelers, preferences }) {
    if (new Date(startDate) <= new Date()) throw new Error('Start date must be in the future');
    if (travelers <= 0) throw new Error('Travelers must be a positive number');
    if (!from || !destination) throw new Error('From and destination are required');
    const request = await models.TravelRequest.create({
      userId,
      from,
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
    const requests = await models.TravelRequest.findAll({
      include: [{
        model: models.User,
        where: { location: agency.location }
      }],
      where: { status: 'open' }
    });
    return requests;
  }

  static async updateRequest(userId, requestId, { from, destination, startDate, travelers, preferences }) {
    const request = await models.TravelRequest.findOne({ where: { id: requestId, userId } });
    if (!request) throw new Error('Travel request not found or unauthorized');
    if (new Date(startDate) <= new Date()) throw new Error('Start date must be in the future');
    if (travelers <= 0) throw new Error('Travelers must be a positive number');
    if (from && destination) {
      await request.update({ from, destination, startDate, travelers, preferences });
    } else {
      await request.update({ startDate, travelers, preferences });
    }
    return true;
  }

  static async deleteRequest(userId, requestId) {
    const request = await models.TravelRequest.findOne({ where: { id: requestId, userId } });
    if (!request) throw new Error('Travel request not found or unauthorized');
    await request.destroy();
    return true;
  }
}

module.exports = { RequestService };
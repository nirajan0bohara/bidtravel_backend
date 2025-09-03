const { models } = require("../models");
const { Op } = require("sequelize");

class RequestService {
  static async createRequest(
    userId,
  { from, destination, startDate, travelers, preferences, phoneNumber }
  ) {
    // Validation
    if (new Date(startDate) <= new Date()) {
      throw new Error("Start date must be in the future");
    }
    if (travelers <= 0) {
      throw new Error("Travelers must be a positive number");
    }
    if (!from || !destination) {
      throw new Error("From and destination are required");
    }
    if (from.trim() === "" || destination.trim() === "") {
      throw new Error("From and destination cannot be empty");
    }

    const request = await models.TravelRequest.create({
      userId,
      from: from.trim(),
      destination: destination.trim(),
      startDate,
      travelers,
      preferences: preferences ? preferences.trim() : null,
      phoneNumber: phoneNumber || null,
    });

    return request.id;
  }

  static async getUserRequests(userId) {
    return await models.TravelRequest.findAll({
      where: { userId },
      include: [
        {
          model: models.User,
          as: "User",
          attributes: ["id", "name", "email", "location"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async getRequestsByLocation(agencyId) {
    // First get the agency's location
    const agency = await models.User.findByPk(agencyId);
    if (!agency) {
      throw new Error("Agency not found");
    }

    // Split agency location into keywords
    const agencyLocationKeywords = agency.location
      .toLowerCase()
      .split(/\s+/)
      .filter((keyword) => keyword.length > 0);

    if (agencyLocationKeywords.length === 0) {
      throw new Error("Agency location is empty");
    }

    // Build the WHERE clause for keyword matching
    const locationConditions = agencyLocationKeywords.map((keyword) => ({
      location: {
        [Op.like]: `%${keyword}%`,
      },
    }));

    // Find all travel requests where the user's location matches any keyword from agency location
    const requests = await models.TravelRequest.findAll({
      include: [
        {
          model: models.User,
          as: "User",
          where: {
            [Op.or]: locationConditions,
          },
          attributes: ["id", "name", "email", "location"],
        },
      ],
      where: { status: "open" },
      order: [["createdAt", "DESC"]],
    });

    return requests;
  }

  static async updateRequest(
    userId,
    requestId,
    { from, destination, startDate, travelers, preferences }
  ) {
    const request = await models.TravelRequest.findOne({
      where: { id: requestId, userId },
    });

    if (!request) {
      throw new Error("Travel request not found or unauthorized");
    }

    // Validation
    if (startDate && new Date(startDate) <= new Date()) {
      throw new Error("Start date must be in the future");
    }
    if (travelers && travelers <= 0) {
      throw new Error("Travelers must be a positive number");
    }

    // Prepare update data
    const updateData = {};
    if (from) updateData.from = from.trim();
    if (destination) updateData.destination = destination.trim();
    if (startDate) updateData.startDate = startDate;
    if (travelers) updateData.travelers = travelers;
    if (preferences !== undefined)
      updateData.preferences = preferences ? preferences.trim() : null;

    await request.update(updateData);
    return true;
  }

  static async deleteRequest(userId, requestId) {
    const request = await models.TravelRequest.findOne({
      where: { id: requestId, userId },
    });

    if (!request) {
      throw new Error("Travel request not found or unauthorized");
    }

    await request.destroy();
    return true;
  }

  static async getRequestById(requestId) {
    return await models.TravelRequest.findByPk(requestId, {
      include: [
        {
          model: models.User,
          as: "User",
          attributes: ["id", "name", "email", "location"],
        },
      ],
    });
  }

  static async updateRequestStatus(userId, requestId, status) {
    const request = await models.TravelRequest.findByPk(requestId, {
      include: [
        {
          model: models.User,
          as: "User",
          attributes: ["id", "name", "email", "location"],
        },
      ],
    });

    if (!request) {
      throw new Error("Travel request not found");
    }

    // Check authorization - users can only update their own requests
    // Agencies can update requests from users in their location
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "user" && request.userId !== userId) {
      throw new Error("Unauthorized - can only update your own requests");
    }

    if (user.role === "agency" && request.User.location !== user.location) {
      throw new Error(
        "Unauthorized - can only update requests from your location"
      );
    }

    await request.update({ status });
    return request;
  }
}

module.exports = { RequestService };

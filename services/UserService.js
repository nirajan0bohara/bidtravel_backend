const { models } = require("../models");

class UserService {
  static async getProfile(userId) {
    return await models.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
  }

  static async updateProfile(userId, { name, location }) {
    await models.User.update({ name, location }, { where: { id: userId } });
  }

  static async getAllUsers(userType) {
    return await models.User.findAll({
      where: { role: userType },
      attributes: ["id", "name", "email", "location", "role"],
    });
  }

  static async verifyAgency(userId, status) {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Invalid status");
    }
    await models.User.update(
      { status },
      { where: { id: userId, role: "agency" } }
    );
  }
}

module.exports = { UserService };

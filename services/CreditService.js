const { models, sequelize } = require("../models");

class CreditService {
  static async assignCredits(agencyId, credits) {
    const transaction = await sequelize.transaction();
    try {
      await models.CreditTransaction.create(
        { agencyId, credits, type: "add" },
        { transaction }
      );

      await models.User.update(
        { credits: sequelize.literal(`credits + ${credits}`) },
        { where: { id: agencyId }, transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  static async getAgencyCredits(agencyId) {
    const agency = await models.User.findByPk(agencyId);
    return agency ? agency.credits : 0;
  }
}

module.exports = { CreditService };

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change the status column to use the correct ENUM values
    await queryInterface.changeColumn("TravelRequests", "status", {
      type: Sequelize.ENUM("open", "closed", "in_progress"),
      defaultValue: "open",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the status column change
    await queryInterface.changeColumn("TravelRequests", "status", {
      type: Sequelize.STRING,
      defaultValue: "open",
      allowNull: false,
    });
  },
};

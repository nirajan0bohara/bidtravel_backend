"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change column to JSON. If existing is TEXT or something invalid, we attempt change; if it was a foreign key reference, remove it first.
    // NOTE: MySQL supports JSON (5.7+). If older version, fallback would be TEXT.
    try {
      await queryInterface.changeColumn("Bids", "packageDetails", {
        type: Sequelize.JSON,
        allowNull: false,
        comment:
          "Snapshot of travel request and offer-specific details (stored as JSON)",
      });
    } catch (err) {
      console.error(
        "Failed to change packageDetails to JSON. Falling back to TEXT. Error:",
        err
      );
      await queryInterface.changeColumn("Bids", "packageDetails", {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "JSON string fallback",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert to TEXT (can't reliably reconstruct prior reference type)
    await queryInterface.changeColumn("Bids", "packageDetails", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};

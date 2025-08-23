"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns if they don't exist. MySQL doesn't support IF NOT EXISTS easily in addColumn via sequelize, so try/catch.
    const addColumnIfMissing = async (table, column, spec) => {
      try {
        await queryInterface.addColumn(table, column, spec);
      } catch (err) {
        if (!/ER_DUP_FIELDNAME|exists/i.test(err.message)) {
          console.warn(`Skipping add column ${column}:`, err.message);
        }
      }
    };

    await addColumnIfMissing("Bids", "requestId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "TravelRequests", key: "id" },
      onDelete: "CASCADE",
    });

    await addColumnIfMissing("Bids", "agencyId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    });

    // Add unique constraint for one bid per agency per request
    try {
      await queryInterface.addConstraint("Bids", {
        fields: ["requestId", "agencyId"],
        type: "unique",
        name: "unique_bid_per_agency_request",
      });
    } catch (err) {
      if (!/exists/i.test(err.message)) {
        console.warn("Skipping unique constraint add:", err.message);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove constraint and columns (order: constraint first due to dependency)
    try {
      await queryInterface.removeConstraint(
        "Bids",
        "unique_bid_per_agency_request"
      );
    } catch (err) {
      if (!/Unknown constraint|doesn't exist/i.test(err.message)) {
        console.warn("Skipping remove constraint:", err.message);
      }
    }

    // Drop columns (ignore if already gone)
    for (const col of ["agencyId", "requestId"]) {
      try {
        await queryInterface.removeColumn("Bids", col);
      } catch (err) {
        if (!/Unknown column|doesn't exist/i.test(err.message)) {
          console.warn(`Skipping remove column ${col}:`, err.message);
        }
      }
    }
  },
};

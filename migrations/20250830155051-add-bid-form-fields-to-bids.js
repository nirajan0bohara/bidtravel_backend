'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bids', 'duration', { type: Sequelize.STRING });
    await queryInterface.addColumn('Bids', 'notes', { type: Sequelize.STRING });
    await queryInterface.addColumn('Bids', 'agencyName', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bids', 'duration');
    await queryInterface.removeColumn('Bids', 'notes');
    await queryInterface.removeColumn('Bids', 'agencyName');
  }
};

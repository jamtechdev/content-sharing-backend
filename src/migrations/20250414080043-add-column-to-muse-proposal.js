'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn("muse_proposals", "winner_declared_at", {
      type: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("muse_proposals", "winner_declared_at")
  }
};

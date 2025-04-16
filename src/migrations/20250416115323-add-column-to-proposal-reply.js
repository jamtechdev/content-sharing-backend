'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn("muse_proposal_replies", "is_winner", {
    type: Sequelize.BOOLEAN,
    defaultValue: false
   })
   queryInterface.addColumn("muse_proposal_replies", "is_runner_up", {
    type: Sequelize.BOOLEAN,
    defaultValue: false
   })
   queryInterface.addColumn("muse_proposal_replies", "winner_declared_at", {
    type: Sequelize.DATE
   })

  },

  async down (queryInterface, Sequelize) {
   queryInterface.removeColumn("muse_proposal_replies", "is_winner")
   queryInterface.removeColumn("muse_proposal_replies", "is_runner_up")
   queryInterface.removeColumn("muse_proposal_replies", "winner_declared_at")
  }
};

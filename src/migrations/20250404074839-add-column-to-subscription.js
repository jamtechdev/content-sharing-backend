'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn("subscription_table", "content_grant", {
    type: Sequelize.DATE
   })
   await queryInterface.addColumn("subscription_table", "last_wildcard_reveal", {
    type: Sequelize.DATE
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("subscription_table", "content_grant")
    await queryInterface.removeColumn("subscription_table", "last_wildcard_reveal")
  }
};

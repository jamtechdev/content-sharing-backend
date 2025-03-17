'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("subscription_table", "chat_count");
    await queryInterface.removeColumn("subscription_table", "video_call_count");
    await queryInterface.addColumn("subscription_table", "coins", {
      type: Sequelize.BIGINT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("subscription_table", "chat_count", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("subscription_table", "video_call_count", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.removeColumn("subscription_table", "coins");
  },
};

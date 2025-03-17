'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("plan_count_extensions", "chat_count");
    await queryInterface.removeColumn("plan_count_extensions", "video_call_count");
    await queryInterface.addColumn("plan_count_extensions", "coins", {
      type: Sequelize.BIGINT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("plan_count_extensions", "chat_count", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("plan_count_extensions", "video_call_count", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.removeColumn("plan_count_extensions", "coins");
  }
};

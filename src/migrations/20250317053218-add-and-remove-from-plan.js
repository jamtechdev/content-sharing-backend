"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("plans", "chat_count");
    await queryInterface.removeColumn("plans", "video_call_count");
    await queryInterface.addColumn("plans", "coins", {
      type: Sequelize.BIGINT
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("plans", "chat_count", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("plans", "video_call_count", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.removeColumn("plans", "coins");
  },
};

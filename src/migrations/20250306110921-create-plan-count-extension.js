'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plan_count_extensions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // subscriber_id: {
      //   type: Sequelize.STRING
      // },
      model_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.ENUM("flexy", "flexyPro", "flexyProMax")
      },
      price: {
        type: Sequelize.FLOAT
      },
      chat_count: {
        type: Sequelize.BIGINT
      },
      video_call_count: {
        type: Sequelize.BIGINT
      },
      // duration : {
      //   type: Sequelize.INTEGER
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plan_count_extensions');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('premium_content_accesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        type: Sequelize.INTEGER
      },
      model_id: {
        type: Sequelize.INTEGER
      },
      content_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.FLOAT,
      },
      stripe_session_id: {
        type: Sequelize.STRING
      },
      payment_mode: {
        type: Sequelize.STRING
      },
      stripe_raw_data: {
        type: Sequelize.STRING
      },
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
    await queryInterface.dropTable('premium_content_accesses');
  }
};
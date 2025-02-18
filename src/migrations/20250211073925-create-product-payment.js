'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      amount_paid: {
        type: Sequelize.DECIMAL
      },
      payment_status: {
        type: Sequelize.ENUM('completed', 'pending', 'failed')
      },
      payment_date: {
        type: Sequelize.DATE
      },
      payment_gateway: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
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
    await queryInterface.addIndex("product_payments", ["order_id", "transaction_id"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_payments');
  }
};
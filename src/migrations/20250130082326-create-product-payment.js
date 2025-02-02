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
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Orders',  // Reference to the Orders table
        //   key: 'id',        // Link to Order's id
        // },
        // onDelete: 'CASCADE',  // If the Order is deleted, delete the ProductPayment as well
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,  // Ensure unique transaction IDs
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount_paid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('completed', 'pending', 'failed'),
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      payment_gateway: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('product_payments');
  }
};
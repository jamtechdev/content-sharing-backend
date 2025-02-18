'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      order_number: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      total_amount: {
        type: Sequelize.DECIMAL
      },
      payment_status: {
        type: Sequelize.ENUM('completed', 'pending', 'failed')
      },
      coupon_id: {
        type: Sequelize.INTEGER
      },
      offer_type: {
        type: Sequelize.JSON
      },
      discount_applied: {
        type: Sequelize.DECIMAL
      },
      shipping_address: {
        type: Sequelize.STRING
      },
      shipping_method: {
        type: Sequelize.STRING
      },
      shipping_cost: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.ENUM('pending', 'shipped', 'delivered', 'canceled')
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
    await queryInterface.addIndex("product_orders", ["user_id", "coupon_id"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_orders');
  }
};
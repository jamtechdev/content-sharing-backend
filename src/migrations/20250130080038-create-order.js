'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Users',  // Reference to the User table
        //   key: 'id',       // User's id
        // },
        // onDelete: 'CASCADE',  // If the User is deleted, the order is deleted
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure order number is unique
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('completed', 'pending', 'failed'),
        allowNull: false,
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: 'Coupons',  // Reference to the Coupons table
        //   key: 'id',
        // },
        // onDelete: 'SET NULL',  // If the coupon is deleted, set this field to NULL
      },
      offer_type: {
        type: Sequelize.STRING,  // Store offer details as JSON
        allowNull: true,
      },
      discount_applied: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,  // Default value of 0 if no discount is applied
      },
      shipping_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shipping_method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shipping_cost: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'shipped', 'delivered', 'canceled'),
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
    await queryInterface.dropTable('Orders');
  }
};
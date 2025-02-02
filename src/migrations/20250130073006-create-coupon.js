'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensures coupon code is unique
      },
      discount_type: {
        type: Sequelize.ENUM('flat', 'percent'),
        allowNull: false, // Required field
      },
      discount_value: {
        type: Sequelize.DECIMAL,
        allowNull: false, // Required field
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        allowNull: false, // Required field
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false, // Required field
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false, // Required field
      },
      min_order_amount: {
        type: Sequelize.INTEGER,
        allowNull: false, // Required field
      },
      max_usage_per_user: {
        type: Sequelize.INTEGER,
        allowNull: false, // Required field
      },
      region_id: {
        type: Sequelize.INTEGER
      },
      user_type: {
        type: Sequelize.ENUM('new_user', 'all_users'),
        allowNull: false, // Required field
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
    await queryInterface.dropTable('Coupons');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        unique: true
      },
      discount_type: {
        type: Sequelize.ENUM('flat', 'percent')
      },
      discount_value: {
        type: Sequelize.DECIMAL
      },
      usage_limit: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      min_order_amount: {
        type: Sequelize.DECIMAL
      },
      max_usage_per_user: {
        type: Sequelize.INTEGER
      },
      region_id: {
        type: Sequelize.INTEGER
      },
      user_type: {
        type: Sequelize.ENUM('new_user', 'all_users')
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
    await queryInterface.addIndex("product_coupons", ["region_id"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_coupons');
  }
};
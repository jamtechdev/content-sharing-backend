'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupon_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Coupons', // Table name
        //   key: 'id',         // Column in the Coupons table
        // },
        // onDelete: 'CASCADE', // Deletes records from CouponProducts when the related Coupon is deleted
      },
      product_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Products', // Table name
        //   key: 'id',         // Column in the Products table
        // },
        // onDelete: 'CASCADE', // Deletes records from CouponProducts when the related Product is deleted
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
    await queryInterface.dropTable('coupon_products');
  }
};
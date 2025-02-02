'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Users',  // Table name in the database
        //   key: 'id',       // Column in the Users table
        // },
        // onDelete: 'CASCADE', // Deletes records from UserCoupons when the related User is deleted
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Coupons',  // Table name in the database
        //   key: 'id',         // Column in the Coupons table
        // },
        // onDelete: 'CASCADE', // Deletes records from UserCoupons when the related Coupon is deleted
      },
      usage_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,  // Start with usage count 0
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
    await queryInterface.dropTable('user_coupons');
  }
};
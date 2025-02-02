"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_offers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Products',  // References Product table
        //   key: 'id',          // The column in Products to reference
        // },
        // allowNull: false,
      },
      offer_type: {
        type: Sequelize.ENUM(
          "buy_x_get_y",
          "buy_x_get_discount",
          "discount_on_total"
        ),
      },
      buy_quantity: {
        type: Sequelize.INTEGER,
      },
      get_quantity: {
        type: Sequelize.INTEGER,
      },
      free_product_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Products',  // References Product table for free product in 'buy_x_get_y' offer
        //   key: 'id',          // The column in Products to reference
        // },
        // allowNull: true,
      },
      discount_value: {
        type: Sequelize.DECIMAL,
      },
      region_id: {
        type: Sequelize.INTEGER,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_offers");
  },
};

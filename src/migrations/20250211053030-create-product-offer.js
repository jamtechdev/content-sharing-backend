'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      offer_type: {
        type: Sequelize.ENUM('buy_x_get_y', 'buy_x_get_discount', 'discount_on_total')
      },
      buy_quantity: {
        type: Sequelize.INTEGER
      },
      get_quantity: {
        type: Sequelize.INTEGER
      },
      free_product_id: {
        type: Sequelize.INTEGER
      },
      discount_value: {
        type: Sequelize.DECIMAL
      },
      region_id: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
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
    await queryInterface.addIndex("product_offers", ["product_id", "region_id"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_offers');
  }
};
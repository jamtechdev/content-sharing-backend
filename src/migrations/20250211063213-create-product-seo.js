'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_seos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      meta_title: {
        type: Sequelize.STRING
      },
      meta_description: {
        type: Sequelize.TEXT
      },
      meta_keywords: {
        type: Sequelize.TEXT
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
    await queryInterface.addIndex("product_seos", ["product_id"])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_seos');
  }
};
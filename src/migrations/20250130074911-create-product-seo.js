'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_SEOs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Products',  // Table name in the database
        //   key: 'id',          // Column in the Products table
        // },
        // onDelete: 'CASCADE',  // Deletes records from ProductSEO when the related Product is deleted
      },
      meta_title: {
        type: Sequelize.STRING,
        allowNull: false,  // Meta title should be required
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: false,  // Meta description should be required
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: false,  // Meta keywords should be required
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
    await queryInterface.dropTable('product_SEOs');
  }
};
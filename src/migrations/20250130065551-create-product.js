'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'ProductCategories',  // References ProductCategory table
        //   key: 'id',                   // The column in ProductCategories to reference
        // },
        // allowNull: false, 
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      short_description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL
      },
      sale_price: {
        type: Sequelize.DECIMAL
      },
      sku: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      stock_quantity: {
        type: Sequelize.INTEGER
      },
      is_featured: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.ENUM('draft', 'pending', 'published', 'out_of_stock', 'archived')
      },
      attributes: {
        type: Sequelize.JSON
      },
      tags: {
        type: Sequelize.JSON
      },
      region_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Products');
  }
};
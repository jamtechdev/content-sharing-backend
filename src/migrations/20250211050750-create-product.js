'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        // references: {
        //   model: "product_media",
        //   key: "product_id"
        // },
        // onDelete: "CASCADE"
      },
      category_id: {
        type: Sequelize.INTEGER
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
        type: Sequelize.STRING,
        unique: true,
      },
      stock_quantity: {
        type: Sequelize.INTEGER
      },
      is_featured: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.ENUM('draft','pending','published','out_of_stock','archived')
      },
      attributes: {
        type: Sequelize.TEXT('long')
      },
      tags: {
        type: Sequelize.TEXT('long')
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
    await queryInterface.addIndex("products", ["category_id", "slug", "region_id"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Orders',  // Reference to the Orders table
        //   key: 'id',        // Link to Order's id
        // },
        // onDelete: 'CASCADE',  // If the Order is deleted, delete the OrderItem as well
      },
      product_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
        // references: {
        //   model: 'Products',  // Reference to the Products table
        //   key: 'id',          // Link to Product's id
        // },
        // onDelete: 'CASCADE',  // If the Product is deleted, delete the OrderItem as well
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price_per_item: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    await queryInterface.dropTable('order_items');
  }
};
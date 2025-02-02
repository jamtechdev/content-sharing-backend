'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_media', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Products',  // References Product table
        //   key: 'id',          // The column in Products to reference
        // },
        // allowNull: false,
      },
      media_type: {
        type: Sequelize.ENUM('image', 'video', 'document')
      },
      file_url: {
        type: Sequelize.STRING
      },
      file_name: {
        type: Sequelize.STRING
      },
      file_size: {
        type: Sequelize.INTEGER
      },
      file_extension: {
        type: Sequelize.STRING
      },
      is_main: {
        type: Sequelize.BOOLEAN
      },
      is_gallery: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('product_media');
  }
};
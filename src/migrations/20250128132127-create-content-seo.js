"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("content_seo", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      content_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        // references: {
        //   model: "Content", // Assuming "Content" table exists
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      meta_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false,
      },
    });

    // Add index for better performance
    await queryInterface.addIndex("content_seo", ["content_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("content_seo");
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contents", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      media_url: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      content_type: {
        type: Sequelize.ENUM("image", "video", "audio", "document"),
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      premium_access: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      region_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
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
    await queryInterface.addIndex("contents", ["user_id"]);
    await queryInterface.addIndex("contents", ["category_id"]);
    await queryInterface.addIndex("contents", ["plan_id"]);
    await queryInterface.addIndex("contents", ["region_id"]);
    // Add the new column content_visibility
    await queryInterface.addColumn("contents", "content_visibility", {
      type: Sequelize.ENUM("all", "subscribers_only", "premium_only"), // Adjust as needed
      defaultValue: "all", // Set a default value if needed
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contents");
  },
};

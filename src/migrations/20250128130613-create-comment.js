"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comment", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "Content",
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      comment_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("approved", "pending", "rejected"),
        defaultValue: "pending",
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

    // Indexes for better performance
    await queryInterface.addIndex("comment", ["user_id"]);
    await queryInterface.addIndex("comment", ["content_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comment");
  },
};

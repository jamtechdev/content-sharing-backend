"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shares", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        //   references: {
        //     model: "Users",
        //     key: "id",
        //   },
        //   onUpdate: "CASCADE",
        //   onDelete: "CASCADE",
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "Contents",
        //   key: "id",
        // },
        // onUpdate: "CASCADE",
        // onDelete: "CASCADE",
      },
      shared_with: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: "Can store user_id, email, or social platform name",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
    await queryInterface.addIndex("Shares", ["user_id"]);
    await queryInterface.addIndex("Shares", ["content_id"]);
    await queryInterface.addIndex("Shares", ["shared_with"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Shares");
  },
};

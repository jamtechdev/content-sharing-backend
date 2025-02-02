"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      message_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("sent", "read", "deleted"),
        allowNull: false,
        defaultValue: "sent",
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
    await queryInterface.addIndex("Messages", ["sender_id"]);
    await queryInterface.addIndex("Messages", ["receiver_id"]);
    await queryInterface.addIndex("Messages", ["status"]);
    await queryInterface.addIndex("Messages", ["created_at"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Messages");
  },
};

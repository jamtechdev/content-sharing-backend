"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payment", {
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
        //   model: "users", // Assuming "users" table exists
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "model_profiles", // Assuming "model_profiles" table exists
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM(
          "credit card",
          "PayPal",
          "bank transfer",
          "crypto"
        ),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM("completed", "pending", "failed"),
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.ENUM(
          "chat_session",
          "video_call",
          "subscription",
          "premium_content",
          "tip"
        ),
        allowNull: false,
      },
      chat_session_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: "Chat_Session", // Assuming "Chat_Session" table exists
        //   key: "id",
        // },
        // onDelete: "SET NULL",
      },
      video_call_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: "Video_Call", // Assuming "Video_Call" table exists
        //   key: "id",
        // },
        // onDelete: "SET NULL",
      },
      premium_content_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: "Premium_Content", // Assuming "Premium_Content" table exists
        //   key: "id",
        // },
        // onDelete: "SET NULL",
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    await queryInterface.addIndex("Payment", ["user_id"]);
    await queryInterface.addIndex("Payment", ["model_id"]);
    await queryInterface.addIndex("Payment", ["transaction_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payment");
  },
};

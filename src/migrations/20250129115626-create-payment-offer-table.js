"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payment_Offers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      offer_type: {
        type: Sequelize.ENUM("chat_session", "video_call"),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "active",
          "inactive",
          "accepted",
          "rejected",
          "payment_pending"
        ),
        allowNull: false,
        defaultValue: "inactive",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
    await queryInterface.addIndex("Payment_Offers", ["user_id"]);
    await queryInterface.addIndex("Payment_Offers", ["model_id"]);
    await queryInterface.addIndex("Payment_Offers", ["status"]);
    await queryInterface.addIndex("Payment_Offers", ["offer_type"]);
    await queryInterface.addIndex("Payment_Offers", ["start_date", "end_date"]);
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

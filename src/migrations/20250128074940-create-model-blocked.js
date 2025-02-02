"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("model_blocked", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      block_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
      },
      subscription_status: {
        type: Sequelize.ENUM("active", "expired"),
        defaultValue: "expired",
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
    await queryInterface.addIndex("model_blocked", ["model_id"]);
    await queryInterface.addIndex("model_blocked", ["user_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("model_blocked");
  },
};

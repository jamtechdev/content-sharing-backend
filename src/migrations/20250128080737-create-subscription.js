"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscription_table", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      subscriber_id: {
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
      },
      plan_id: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.ENUM("active", "expired", "canceled"),
        defaultValue: "active",
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
    await queryInterface.addIndex("subscription_table", ["subscriber_id"]);
    await queryInterface.addIndex("subscription_table", ["model_id"]);
    await queryInterface.addIndex("subscription_table", ["plan_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subscription_table");
  },
};

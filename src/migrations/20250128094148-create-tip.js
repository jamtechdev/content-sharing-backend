"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tip_table", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tipper_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "model_profiles",
        //   key: "id",
        // },
        // onDelete: "CASCADE",
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: "Content",
        //   key: "id",
        // },
        // onDelete: "SET NULL",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM("completed", "pending", "failed"),
        allowNull: false,
        defaultValue: "pending",
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
    await queryInterface.addIndex("tip_table", ["tipper_id"]);
    await queryInterface.addIndex("tip_table", ["model_id"]);
    await queryInterface.addIndex("tip_table", ["content_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tip_table");
  },
};

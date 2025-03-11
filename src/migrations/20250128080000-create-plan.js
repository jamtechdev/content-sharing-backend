"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("plans", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      name: {
        type: Sequelize.ENUM("basic", "premium"),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      is_premium_access_included: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chat_count: {
        type: Sequelize.BIGINT
      },
      video_call_count: {
        type: Sequelize.BIGINT
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
    await queryInterface.addIndex("plans", ["model_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("plans");
  },
};

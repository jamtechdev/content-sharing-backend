"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Plans", {
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
        type: Sequelize.ENUM("basic", "premium", "gold"),
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false,
      },
    });
    await queryInterface.addIndex("Plans", ["model_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Plans");
  },
};

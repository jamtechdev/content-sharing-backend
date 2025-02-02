"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("followers", {
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
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key: "id",
        // },
        // onDelete: "CASCADE",
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
    await queryInterface.addIndex("followers", ["user_id"]);
    await queryInterface.addIndex("followers", ["follower_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("followers");
  },
};

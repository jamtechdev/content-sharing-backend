"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "premium_accesses",

      {
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
        content_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // references: {
          //   model: "Content", // Assuming "Content" table exists
          //   key: "id",
          // },
          // onDelete: "CASCADE",
        },
        access_granted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        access_expires: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          // defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          // defaultValue: Sequelize.literal(
          //   "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          // ),
          allowNull: false,
        },
      }
    );
    await queryInterface.addIndex("premium_accesses", ["user_id"]);
    await queryInterface.addIndex("premium_accesses", ["content_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("premium_accesses");
  },
};

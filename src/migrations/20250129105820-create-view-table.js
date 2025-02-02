"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Views", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
        validate: {
          isIP: true,
        },
      },
      viewed_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("Views", ["user_id"]);
    await queryInterface.addIndex("Views", ["content_id"]);
    await queryInterface.addIndex("Views", ["viewed_at"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Views");
  },
};

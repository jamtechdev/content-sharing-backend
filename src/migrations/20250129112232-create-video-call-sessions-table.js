"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VideoCallSessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "active", "completed"),
        defaultValue: "pending",
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
      agora_channel_id: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("VideoCallSessions", ["user_id"]);
    await queryInterface.addIndex("VideoCallSessions", ["model_id"]);
    await queryInterface.addIndex("VideoCallSessions", ["status"]);
    await queryInterface.addIndex("VideoCallSessions", ["agora_channel_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("VideoCallSessions");
  },
};

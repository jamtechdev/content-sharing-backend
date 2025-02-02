"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChatSessions", {
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
      duration: {
        type: Sequelize.INTEGER, 
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
    await queryInterface.addIndex("ChatSessions", ["user_id"]);
    await queryInterface.addIndex("ChatSessions", ["model_id"]);
    await queryInterface.addIndex("ChatSessions", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ChatSessions");
  },
};

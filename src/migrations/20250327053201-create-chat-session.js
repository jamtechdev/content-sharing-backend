'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "ended"),
        defaultValue: "pending"
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      last_activity: {
        type: Sequelize.DATE,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {min: 1, max: 5}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex("chat_sessions", ["user_id"]);
    await queryInterface.addIndex("chat_sessions", ["model_id"]);
    await queryInterface.addIndex("chat_sessions", ["status"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat_sessions');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chat_session_id: {
        type: Sequelize.INTEGER
      },
      sender_id: {
        type: Sequelize.INTEGER
      },
      sender_type: {
        type: Sequelize.ENUM("user", "model")
      },
      message_type: {
        type: Sequelize.ENUM("text", "image", "video", "audio")
      },
      message: {
        type: Sequelize.STRING
      },
      media_url: {
        type: Sequelize.STRING
      },
      media_type: {
        type: Sequelize.STRING
      },
      media_size: {
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.DATE
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      },
      is_edited: {
        type: Sequelize.BOOLEAN
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat_messages');
  }
};
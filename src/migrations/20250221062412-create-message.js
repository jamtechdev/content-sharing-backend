'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      senderId: {
        type: Sequelize.INTEGER
      },
      receiverId: {
        type: Sequelize.INTEGER
      },
      mediaUrl: {
        type: Sequelize.TEXT('long')
      },
      mediaType: {
        type: Sequelize.STRING,
      },
      mediaSize: {
        type: Sequelize.FLOAT,
      },
      messageId: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("sent", "pending", "delivered", "seen"),
      },
      isEdited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deletedBy: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Default to current time
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Default to current time
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};
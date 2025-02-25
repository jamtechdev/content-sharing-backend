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
      status: {
        type: Sequelize.ENUM("sent", "pending", "delivered", "seen"),
      },
      isDeletedBySender: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isDeletedByReceiver: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('Messages');
  }
};
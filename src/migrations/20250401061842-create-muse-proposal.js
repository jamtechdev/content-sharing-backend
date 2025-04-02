'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('muse_proposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscriber_id: {
        type: Sequelize.INTEGER
      },
      plan_id: {
        type: Sequelize.INTEGER
      },
      proposal: {
        type: Sequelize.TEXT('long')
      },
      status: {
        type: Sequelize.ENUM("pending", "selected", "rejected"),
        defaultValue: "pending"
      },
      total_vote_count: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      upvote_count: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      is_winner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_runner_up: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      polling_status: {
        type: Sequelize.ENUM("open","closed"),
        defaultValue: "open"
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
    await queryInterface.dropTable('muse_proposals');
  }
};
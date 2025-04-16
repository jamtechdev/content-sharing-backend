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
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      proposal: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
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
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending"
      },
      polling_status: {
        type: Sequelize.ENUM("open","closed"),
        defaultValue: "open"
      },
      proposal_type: {
        type: Sequelize.ENUM("poll", "question"),
      },

      winner_declared_at: {
        type: Sequelize.DATE
      },
      seen_status: {
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
    await queryInterface.dropTable('muse_proposals');
  }
};
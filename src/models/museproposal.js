'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuseProposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MuseProposal.hasMany(models.muse_proposal_polling, {
        foreignKey: "proposal_id",
        as: "poll_data"
      })
    }
  }
  MuseProposal.init({
    subscriber_id: DataTypes.INTEGER,
    plan_id: DataTypes.INTEGER,
    proposal: DataTypes.TEXT('long'),
    status:{type: DataTypes.ENUM("pending", "selected", "rejected"),defaultValue: "pending"},
    total_vote_count: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    upvote_count: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    is_winner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_runner_up: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    polling_status: {
      type: DataTypes.ENUM("open","closed"),
      defaultValue: "open"
    }
  }, {
    sequelize,
    modelName: 'muse_proposal',
  });
  return MuseProposal;
};
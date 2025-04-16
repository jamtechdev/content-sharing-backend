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
      MuseProposal.belongsTo(models.users, {
        foreignKey: "subscriber_id",
        as: "profile"
      })
      MuseProposal.hasMany(models.muse_proposal_replies, {
        foreignKey: "proposal_id",
        as: "reply"
      })
    }
  }
  MuseProposal.init({
    subscriber_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    proposal: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
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
    status:{
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending"
    },
    polling_status: {
      type: DataTypes.ENUM("open","closed"),
      defaultValue: "open"
    },
    proposal_type: {
      type: DataTypes.ENUM("poll", "question")
    },
    winner_declared_at: {
      type: DataTypes.DATE,
    },
    seen_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    }
  }, {
    sequelize,
    modelName: 'muse_proposal',
  });
  return MuseProposal;
};
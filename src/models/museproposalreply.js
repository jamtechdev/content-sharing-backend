'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class museProposalReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      museProposalReply.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      })
      museProposalReply.belongsTo(models.muse_proposal, {
        foreignKey: "proposal_id",
        as: "proposal"
      })
    }
  }
  museProposalReply.init({
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      defaultValue: false
    },
    reply: {
      type: DataTypes.TEXT('long'),
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending"
    }
  }, {
    sequelize,
    modelName: 'muse_proposal_replies',
  });
  return museProposalReply;
};
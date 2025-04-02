'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuseProposalPolling extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MuseProposalPolling.init({
    proposal_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    vote: {
      type: DataTypes.ENUM('yes', 'no')
    }
  }, {
    sequelize,
    modelName: 'muse_proposal_polling',
  });
  return MuseProposalPolling;
};
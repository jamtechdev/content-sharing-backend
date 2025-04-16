'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuseProposalWinner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MuseProposalWinner.init({
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    winning_status: {
      type: DataTypes.ENUM("winner", "runner_up"),
    },
    winner_declared_at: DataTypes.DATE,
    seen_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'MuseProposalWinner',
  });
  return MuseProposalWinner;
};
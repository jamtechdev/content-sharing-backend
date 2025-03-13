'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HelpAndSupport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HelpAndSupport.init({
    category: DataTypes.TEXT('long'),
    query: DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'help_and_support',
  });
  return HelpAndSupport;
};
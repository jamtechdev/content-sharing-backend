'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdditionalSupport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdditionalSupport.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'additional_support',
  });
  return AdditionalSupport;
};
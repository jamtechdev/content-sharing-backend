'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanCountExtension extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PlanCountExtension.init({
    // subscriber_id: DataTypes.STRING,
    model_id: DataTypes.STRING,
    name: DataTypes.ENUM("flexy", "flexyPro", "flexyProMax"),
    price: DataTypes.FLOAT,
    coins: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'plan_count_extension',
  });
  return PlanCountExtension;
};
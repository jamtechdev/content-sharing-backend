'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WildcardReveal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WildcardReveal.init({
    reveal_content: DataTypes.STRING,
    reveal_type: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    reveal_date: DataTypes.DATE,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'wildcard_reveal',
  });
  return WildcardReveal;
};
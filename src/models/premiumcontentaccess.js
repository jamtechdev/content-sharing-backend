'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PremiumContentAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // PremiumContentAccess.belongsTo(models.users, {
      //   foreignKey: "buyer_id",
      //   as: "user"
      // })
    }
  }
  PremiumContentAccess.init({
    buyer_id: DataTypes.INTEGER,
    model_id: DataTypes.INTEGER,
    content_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    stripe_session_id: DataTypes.STRING,
    payment_mode: DataTypes.STRING,
    stripe_raw_data: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'premium_content_access',
  });
  return PremiumContentAccess;
};
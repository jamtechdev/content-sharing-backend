'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCoupons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductCoupons.init({
    code: {
      type: DataTypes.STRING,
      unique: true,
    },
    discount_type: DataTypes.ENUM('flat', 'percent'),
    discount_value: DataTypes.DECIMAL,
    usage_limit: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    min_order_amount: DataTypes.DECIMAL,
    max_usage_per_user: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    user_type: DataTypes.ENUM('new_user', 'all_users')
  }, {
    sequelize,
    modelName: 'product_coupon',
  });
  return ProductCoupons;
};
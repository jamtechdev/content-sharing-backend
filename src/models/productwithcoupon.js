'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductWithCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductWithCoupon.belongsTo(models.product, {
        foreignKey: "product_id",
        as: "product"
      })

      ProductWithCoupon.belongsTo(models.product_coupon, {
        foreignKey: "coupon_id",
        as: "coupon"
      })
    }
  }
  ProductWithCoupon.init({
    coupon_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product_with_coupon',
  });
  return ProductWithCoupon;
};
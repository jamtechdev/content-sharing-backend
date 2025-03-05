'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductOrder.belongsTo(models.product_coupon, {
        foreignKey: "coupon_id", 
        as: "coupon"
      })
      ProductOrder.hasMany(models.order_items, {
        foreignKey: "order_id",
        as: "orderItems"
      })
    }
  }
  ProductOrder.init({
    user_id: DataTypes.INTEGER,
    order_number: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    total_amount: DataTypes.DECIMAL,
    payment_status: DataTypes.ENUM('completed', 'pending', 'failed'),
    coupon_id: DataTypes.INTEGER,
    offer_type: DataTypes.JSON,
    discount_applied: DataTypes.DECIMAL,
    shipping_address: DataTypes.STRING,
    shipping_method: DataTypes.STRING,
    shipping_cost: DataTypes.DECIMAL,
    status: DataTypes.ENUM('pending', 'shipped', 'delivered', 'canceled'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'product_order',
  });
  return ProductOrder;
};
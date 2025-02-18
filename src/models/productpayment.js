'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductPayment.init({
    order_id: DataTypes.INTEGER,
    transaction_id: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    amount_paid: DataTypes.DECIMAL,
    payment_status: DataTypes.ENUM('completed', 'pending', 'failed'),
    payment_date: DataTypes.DATE,
    payment_gateway: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'product_payment',
  });
  return ProductPayment;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDiscount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductDiscount.belongsTo(models.product, {
        foreignKey: "product_id",
        as: "product"
      })
    }
  }
  ProductDiscount.init({
    product_id: DataTypes.INTEGER,
    discount_type: DataTypes.ENUM('flat', 'percent'),
    discount_value: DataTypes.DECIMAL,
    status: DataTypes.ENUM("active", "expired", "upcoming"),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'product_discount',
  });
  return ProductDiscount;
};
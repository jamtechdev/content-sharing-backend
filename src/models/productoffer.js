'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOffer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductOffer.init({
    product_id: DataTypes.INTEGER,
    offer_type: DataTypes.ENUM('buy_x_get_y', 'buy_x_get_discount', 'discount_on_total'),
    buy_quantity: DataTypes.INTEGER,
    get_quantity: DataTypes.INTEGER,
    free_product_id: DataTypes.INTEGER,
    discount_value: DataTypes.DECIMAL,
    region_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'product_offer',
  });
  return ProductOffer;
};
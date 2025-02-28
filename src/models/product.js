'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.product_category, {
        foreignKey: "category_id",
        as: "category"
      })
      Product.hasOne(models.product_media, {
        foreignKey: "product_id",
        as: "media",
        onDelete: "CASCADE"
      })
      Product.hasMany(models.product_attribute, {
        foreignKey: "product_id",
        as: "attributes_data"
      })
      Product.hasOne(models.product_discount, {
        foreignKey: "product_id",
        as: "product_discount"
      })
      Product.hasOne(models.product_offer, {
        foreignKey: "product_id",
        as: "product_offer"
      })
      Product.hasOne(models.product_with_coupon, {
        foreignKey: "product_id",
        as: "product_with_coupon"
      })
      Product.hasOne(models.product_seo, {
        foreignKey: "product_id",
        as: "product_seo"
      })
    }
  }
  Product.init({
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    short_description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    sale_price: DataTypes.DECIMAL,
    sku: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    stock_quantity: DataTypes.INTEGER,
    is_featured: DataTypes.BOOLEAN,
    status: DataTypes.ENUM('draft','pending','published','out_of_stock','archived'),
    attributes: DataTypes.TEXT('long'),
    tags: DataTypes.TEXT('long'),
    region_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product',
  });
  return Product;
};
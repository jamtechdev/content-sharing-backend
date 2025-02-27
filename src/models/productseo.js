'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSEO extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductSEO.belongsTo(models.product, {
        foreignKey: "product_id",
        as: "product"
      })
    }
  }
  ProductSEO.init({
    product_id: DataTypes.INTEGER,
    meta_title: DataTypes.STRING,
    meta_description: DataTypes.TEXT,
    meta_keywords: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'product_seo',
  });
  return ProductSEO;
};
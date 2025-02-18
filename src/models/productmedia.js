'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductMedia.init({
    product_id: DataTypes.INTEGER,
    media_type: DataTypes.ENUM('image','video','document'),
    file_url: DataTypes.STRING,
    file_name: DataTypes.STRING,
    file_size: DataTypes.INTEGER,
    file_extension: DataTypes.STRING,
    is_main: DataTypes.BOOLEAN,
    is_gallery: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product_media',
  });
  return ProductMedia;
};
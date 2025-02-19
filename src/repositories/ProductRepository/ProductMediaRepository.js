const db = require("../../models/index");
const ProductMedia = db.product_media
const { Op } = require("sequelize");

class ProductMediaRepository {
  async create(data) {
    return await ProductMedia.create(data);
  }

  async getAll() {
    return await ProductMedia.findAll();
  }

  async getById(mediaId) {
    return await ProductMedia.findOne({ where: { id: mediaId } });
  }

  async getByProductId(productId) {
    return await ProductMedia.findAll({ where: { product_id: productId } });
  }

  async getMainMediaByProductId(productId) {
    return await ProductMedia.findOne({
      where: { product_id: productId, is_main: true },
    });
  }

  async getGalleryByProductId(productId) {
    return await ProductMedia.findAll({
      where: { product_id: productId, is_gallery: true },
    });
  }

  async update(mediaId, data) {
    return await ProductMedia.update(data, { where: { id: mediaId } });
  }

  async delete(mediaId) {
    return await ProductMedia.destroy({ where: { id: mediaId } });
  }

  async deleteByProductId(productId) {
    return await ProductMedia.destroy({ where: { product_id: productId } });
  }
}

module.exports = new ProductMediaRepository();

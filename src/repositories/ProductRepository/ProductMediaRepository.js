const db = require("../../models/index");
const ProductMedia = db.product_media;
const Product = db.product;
const ProductCategory = db.product_category;
const { Op } = require("sequelize");

class ProductMediaRepository {
  async create(data) {
    return await ProductMedia.create(data);
  }

  async getAll() {
    return await ProductMedia.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  async getById(mediaId) {
    return await ProductMedia.findOne({
      where: { id: mediaId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  async getByProductId(productId) {
    return await ProductMedia.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  async getMainMediaByProductId(productId) {
    return await ProductMedia.findOne({
      where: { product_id: productId, is_main: true },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
  }

  async getGalleryByProductId(productId) {
    return await ProductMedia.findAll({
      where: { product_id: productId, is_gallery: true },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
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

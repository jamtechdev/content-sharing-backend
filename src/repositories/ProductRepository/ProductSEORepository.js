const db = require("../../models/index");

const ProductSEO = db.product_seo;
const Product = db.product;

class ProductSEORepository {
  async create(data) {
    return await ProductSEO.create(data);
  }

  async getAll() {
    return await ProductSEO.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getAll(id) {
    return await ProductSEO.findAll({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getById(id) {
    return await ProductSEO.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getByProductId(id) {
    return await ProductSEO.findOne({
      where: { product_id:id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async searchByTitle(search) {
    return await ProductSEO.findAll({
      where: {
        meta_title: {
          [db.Sequelize.Op.like]: `%${search}%`,
        },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async searchByKeywords(search) {
    return await ProductSEO.findAll({
      where: {
        meta_keywords: {
          [db.Sequelize.Op.like]: `%${search}%`,
        },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async update(data) {
    return await ProductSEO.update(data, {
      where: {
        id: data.id,
      },
    });
  }

  async deleteById(id) {
    return await ProductSEO.destroy({
      where: {
        id,
      },
    });
  }

  async deleteByProductId(productId) {
    return await ProductSEO.destroy({
      where: {
        id: productId,
      },
    });
  }
}

module.exports = new ProductSEORepository();

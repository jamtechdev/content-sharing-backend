const db = require("../models/index");
const Product = db.product
const { Op } = require("sequelize");


class ProductRepository {
  async create(data) {
    const {
        category_id,
        name,
        description,
        short_description,
        price,
        sale_price,
        sku,
        slug,
        type,
        unique,
        stock_quantity,
        is_featured,
        status,
        attributes,
        tags,
        region_id,
      } = data
    return await Product.create({
        category_id,
        name,
        description,
        short_description,
        price,
        sale_price,
        sku,
        slug,
        type,
        unique,
        stock_quantity,
        is_featured,
        status,
        attributes: JSON.stringify(attributes),
        tags: JSON.stringify(tags),
        region_id,
    })
  }

  async getAll() {
    return await Product.findAll({ status: "published" });
  }

  async getById(productId) {
    return await Product.findOne({ where: { id: productId } });
  }

  async getBySlug(slugId) {
    return await Product.findOne({ where: { slug: slugId } });
  }

  async getByRegionId(regionId) {
    return await Product.findAll({ where: { region_id: regionId } });
  }

  async getByCategoryId(categoryId) {
    return await Product.findAll({ where: { category_id: categoryId } });
  }

  async getByTag(tag) {
    return await Product.findAll({
      where: {
        tags: {
          [Op.like]: `%${tag}%`,
        },
      },
    });
  }

  async getByName(name) {
    return await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  async update(productId, data) {
    return await Product.update(data, { where: { id: productId } });
  }

  async delete(productId) {
    return await Product.destroy({ where: { id: productId } });
  }
}

module.exports = new ProductRepository();

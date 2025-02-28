const db = require("../../models/index");
const Product = db.product;
const Category = db.product_category;
const ProductMedia = db.product_media;
const { Op } = require("sequelize");

class ProductRepository {
  async create(data) {
    return await Product.create(data);
  }

  async getAll() {
    return await Product.findAll({
      status: "published",
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMedia,
          as: "media",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getById(id) {
    return await Product.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMedia,
          as: "media",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getBySlug(slugId) {
    return await Product.findOne({
      where: { slug: slugId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMedia,
          as: "media",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getByRegionId(regionId) {
    return await Product.findAll({
      where: { region_id: regionId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMedia,
          as: "media",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getByCategoryId(categoryId) {
    return await Product.findAll({
      where: { category_id: categoryId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMedia,
          as: "media",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  // async getByTag(tag) {
  //   return await Product.findAll({
  //     where: {
  //       tags: {
  //         [Op.like]: `%${tag}%`,
  //       },
  //     },
  //     include: [
  //       {
  //         model: Category,
  //         as: "category",
  //         attributes: { exclude: ["createdAt", "updatedAt"] },
  //       },
  //     ],
  //   });
  // }

  async searchProduct(search) {
    return await Product.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { name: { [db.Sequelize.Op.like]: `%${search}%` } },
          { description: { [db.Sequelize.Op.like]: `%${search}%` } },
          { short_description: { [db.Sequelize.Op.like]: `%${search}%` } },
          { tags: { [db.Sequelize.Op.like]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
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

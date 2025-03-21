const db = require("../../models/index");
const Product = db.product;
const Category = db.product_category;
const ProductMedia = db.product_media;
const productAttribute = db.product_attribute;
const productDiscount = db.product_discount;
const productOffer = db.product_offer;
const productWithCoupon = db.product_with_coupon;
const ProductCoupon = db.product_coupon;
const ProductSEO = db.product_seo;

const { Op, where } = require("sequelize");

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
        {
          model: productAttribute,
          as: "attributes_data",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: productDiscount,
          as: "product_discount",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          required: false,
          where: {
            status: {
              [db.Sequelize.Op.or]: ["active", "upcoming"],
            },
          },
        },
        {
          model: productOffer,
          as: "product_offer",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: productWithCoupon,
          as: "product_with_coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductCoupon,
              as: "coupon",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: ProductSEO,
          as: "product_seo",
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
        {
          model: productAttribute,
          as: "attributes_data",
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
        {
          model: productAttribute,
          as: "attributes_data",
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
        {
          model: productAttribute,
          as: "attributes_data",
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
        {
          model: productAttribute,
          as: "attributes_data",
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
        {
          model: ProductMedia,
          as: "media",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: productAttribute,
          as: "attributes_data",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: productAttribute,
          as: "attributes_data",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async update(productId, data) {
    if (data?.tags) {
      data.tags = JSON.stringify(data.tags);
    }
    return await Product.update({ ...data }, { where: { id: productId } });
  }

  async delete(productId) {
    return await Product.destroy({ where: { id: productId } });
  }
}

module.exports = new ProductRepository();

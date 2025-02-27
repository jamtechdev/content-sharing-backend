const db = require("../../models/index");
const ProductOffer = db.product_offer;
const Product = db.product;
const ProductCategory = db.product_category;

class ProductOfferRepository {
  async create(data) {
    return await ProductOffer.create(data);
  }

  async getAll() {
    const currentDate = new Date();
    return await ProductOffer.findAll({
      where: {
        start_date: { [db.Sequelize.Op.lte]: currentDate },
        end_date: { [db.Sequelize.Op.gte]: currentDate },
      },
      attributes: {exclude: ["createdAt", "updatedAt"]},
      include: [
        {
          model: Product,
          as: "product",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: {exclude: ["createdAt", "updatedAt"]}
            },
          ],
        },
        {
          model: Product,
          as: "freeProduct",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: {exclude: ["createdAt", "updatedAt"]}
            },
          ],
        },
      ],
    });
  }

  async getById(offerId) {
    const currentDate = new Date();
    return await ProductOffer.findOne({
      where: {
        id: offerId,
        start_date: { [db.Sequelize.Op.lte]: currentDate },
        end_date: { [db.Sequelize.Op.gte]: currentDate },
      },
      attributes: {exclude: ["createdAt", "updatedAt"]},
      include: [
        {
          model: Product,
          as: "product",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: {exclude: ["createdAt", "updatedAt"]}
            },
          ],
        },
        {
          model: Product,
          as: "freeProduct",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: {exclude: ["createdAt", "updatedAt"]}
            },
          ],
        },
      ],
    });
  }

  async getByProductId(productId) {
    const currentDate = new Date();
    return await ProductOffer.findAll({
      where: {
        product_id: productId,
        start_date: { [db.Sequelize.Op.lte]: currentDate },
        end_date: { [db.Sequelize.Op.gte]: currentDate },
      },
      attributes: {exclude: ["createdAt", "updatedAt"]},
      include: [
        {
          model: Product,
          as: "product",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: {exclude: ["createdAt", "updatedAt"]}
            },
          ],
        },
        {
          model: Product,
          as: "freeProduct",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: {exclude: ["createdAt", "updatedAt"]}
            },
          ],
        },
      ],
    });
  }

  async getActiveOffers(productId) {
    const currentDate = new Date();
    return await ProductOffer.findAll({
      where: {
        product_id: productId,
        start_date: { [db.Sequelize.Op.lte]: currentDate },
        end_date: { [db.Sequelize.Op.gte]: currentDate },
      },
    });
  }

  async update(offerId, data) {
    return await ProductOffer.update(data, { where: { id: offerId } });
  }

  async delete(offerId) {
    return await ProductOffer.destroy({ where: { id: offerId } });
  }

  async deleteByProductId(productId) {
    return await ProductOffer.destroy({ where: { product_id: productId } });
  }
}

module.exports = new ProductOfferRepository();

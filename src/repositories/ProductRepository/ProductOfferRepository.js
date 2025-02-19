const db = require("../../models/index");
const ProductOffer = db.product_offer

class ProductOfferRepository {
  async create(data) {
    return await ProductOffer.create(data);
  }

  async getAll() {
    return await ProductOffer.findAll();
  }

  async getById(offerId) {
    return await ProductOffer.findByPk(offerId);
  }

  async getByProductId(productId) {
    return await ProductOffer.findAll({ where: { product_id: productId } });
  }

  async getActiveOffers(productId, currentDate) {   
    return await ProductOffer.findAll({
      where: {
        product_id: productId,
        start_date: { $lte: currentDate },
        end_date: { $gte: currentDate },
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

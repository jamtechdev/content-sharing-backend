const ProductOfferRepository = require("../../repositories/ProductRepository/ProductOfferRepository");
const HttpError = require("../../decorators/HttpError");

class ProductOfferService {
  async createProductOffer(data) {
    if (!data.product_id || !data.offer_type) {
      throw new HttpError(400, "Product ID and Offer Type are required");
    }
    const productOffer = await ProductOfferRepository.create(data);
    return productOffer;
  }

  async getAllProductOffers() {
    const offers = await ProductOfferRepository.getAll();
    if (offers.length === 0) {
      throw new HttpError(404, "No product offers found");
    }
    return offers;
  }

  async getProductOfferById(offerId) {
    const offer = await ProductOfferRepository.getById(offerId);
    if (!offer) {
      throw new HttpError(404, "Product offer not found");
    }
    return offer;
  }

  async getProductOffersByProductId(productId) {
    const offers = await ProductOfferRepository.getByProductId(productId);
    if (offers.length === 0) {
      throw new HttpError(404, "No offers found for this product");
    }
    return offers;
  }

  async getActiveOffers(productId) {
    const offers = await ProductOfferRepository.getActiveOffers(productId);
    if (offers.length === 0) {
      throw new HttpError(404, "No active offers for this product");
    }
    return offers;
  }

  async updateProductOffer(offerId, data) {
    const offer = await ProductOfferRepository.getById(offerId);
    if (!offer) {
      throw new HttpError(404, "Product offer not found");
    }
    const updatedOffer = await ProductOfferRepository.update(offerId, data);
    return updatedOffer;
  }

  async deleteProductOffer(offerId) {
    const offer = await ProductOfferRepository.getById(offerId);
    if (!offer) {
      throw new HttpError(404, "Product offer not found");
    }
    return await ProductOfferRepository.delete(offerId);
  }

  async deleteOffersByProductId(productId) {
    const offers = await ProductOfferRepository.getByProductId(productId);
    if (offers.length === 0) {
      throw new HttpError(404, "No offers found for this product");
    }
    return await ProductOfferRepository.deleteByProductId(productId);
  }
}

module.exports = new ProductOfferService();

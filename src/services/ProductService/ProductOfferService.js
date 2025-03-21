const ProductOfferRepository = require("../../repositories/ProductRepository/ProductOfferRepository");
const HttpError = require("../../decorators/HttpError");

class ProductOfferService {
  async createProductOffer(data) {
    const offerExist = await ProductOfferRepository.getByProductId(data.product_id);
    if(offerExist){
      return {code: "ERR409", message: "Offer already created for the product"}
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
      return {code: "ERR404", message: "Product offer not found"}
    }
    return offer;
  }

  async getProductOffersByProductId(productId) {
    const offer = await ProductOfferRepository.getByProductId(productId);
    if (!offer) {
      throw new HttpError(404, "No offers found for this product");
    }
    return offer;
  }

  async getActiveOffers(productId) {
    const offers = await ProductOfferRepository.getActiveOffers(productId);
    if (offers.length === 0) {
      throw new HttpError(404, "No active offers for this product");
    }
    return offers;
  }

  // async updateProductOffer(offerId, data) {
  //   const offer = await ProductOfferRepository.getById(offerId);
  //   if (!offer) {
  //     return {code: "ERR404", message: "Product offer not found"}
  //   }
  //   const updatedOffer = await ProductOfferRepository.update(offerId, data);
  //   return updatedOffer;
  // }
  async updateProductOffer(offerId, data) {
    const offer = await ProductOfferRepository.getById(offerId);
    if (!offer) {
      return { code: "ERR404", message: "Product offer not found" };
    }
  console.log(data, "Product offer")
    // Validate required fields based on `offer_type`
    if (data.offer_type === "buy_x_get_y") {
      if (!data.buy_quantity || !data.get_quantity || !data.free_product_id) {
        return { code: "ERR400", message: "Missing required fields for 'buy_x_get_y'" };
      }
      data.discount_value = null; // Not needed for this offer type
    } else if (data.offer_type === "buy_x_get_discount") {
      if (!data.buy_quantity || !data.discount_value) {
        return { code: "ERR400", message: "Missing required fields for 'buy_x_get_discount'" };
      }
      data.get_quantity = null;
      data.free_product_id = null;
    } else if (data.offer_type === "discount_on_total") {
      if (!data.discount_value) {
        return { code: "ERR400", message: "Missing required fields for 'discount_on_total'" };
      }
      data.buy_quantity = null;
      data.get_quantity = null;
      data.free_product_id = null;
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
    const offer = await ProductOfferRepository.getByProductId(productId);
    if (!offer) {
      throw new HttpError(404, "No offers found for this product");
    }
    return await ProductOfferRepository.deleteByProductId(productId);
  }
}

module.exports = new ProductOfferService();

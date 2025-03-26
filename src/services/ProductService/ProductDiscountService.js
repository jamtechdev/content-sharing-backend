const ProductDiscountRepository = require("../../repositories/ProductRepository/ProductDiscountRepository");
const ProductRepository = require('../../repositories/ProductRepository/ProductRepository')
const HttpError = require("../../decorators/HttpError");

class ProductDiscountService {
  async createProductDiscount(data) {
    const currentDate = new Date()
    const startDate=  new Date(data.start_date);
    const endDate= new Date(data.end_date);
    if(endDate < currentDate){
      return {code: 400, message: "End date should be greater than or equal current date"}
    }
    if(startDate > endDate){
      return {code: 400, message: "Start date should be smaller than or equal to end date"}
    }
    const product = await ProductRepository.getById(data.product_id)
    if(!product){
      return {code: 404, message: "Product not found"}
    }
    const alreadyDiscountCreated = await ProductDiscountRepository.getByProductId(data.product_id)
    if(alreadyDiscountCreated){
      return {code: 409, message: "Product discount already created"}
    }
    return await ProductDiscountRepository.create(data);
  }

  async getAllProductDiscounts() {
    const discounts = await ProductDiscountRepository.getAll();
    return discounts;
  }

  async getProductDiscountById(discountId) {
    const discount = await ProductDiscountRepository.getById(discountId);
       return discount;
  }

  async getProductDiscountsByProductId(productId) {
    const discounts = await ProductDiscountRepository.getByProductId(productId);
    if (!discounts) {
      throw new HttpError(404, "No discounts found for this product");
    }
    return discounts;
  }

  // async getActiveProductDiscounts(productId) {
  //   const discounts = await ProductDiscountRepository.getActiveDiscounts(productId);
  //   if (discounts.length === 0) {
  //     throw new HttpError(404, "No active discounts found for this product");
  //   }
  //   return discounts;
  // }

  async updateProductDiscount(discountId, data) {
    const discount = await ProductDiscountRepository.getById(discountId);
    if (!discount) {
      throw new HttpError(404, "Product discount not found");
    }
    await ProductDiscountRepository.update(discountId, data);
    return { message: "Product discount updated successfully" };
  }

  async deleteProductDiscount(discountId) {
    const discount = await ProductDiscountRepository.getById(discountId);
    if (!discount) {
      throw new HttpError(404, "Product discount not found");
    }
    await ProductDiscountRepository.delete(discountId);
    return { message: "Product discount deleted successfully" };
  }

  // async deleteDiscountsByProductId(productId) {
  //   const discounts = await ProductDiscountRepository.getByProductId(productId);
  //   if (discounts.length === 0) {
  //     throw new HttpError(404, "No discounts found for this product");
  //   }
  //   await ProductDiscountRepository.deleteByProductId(productId);
  //   return { message: "All product discounts deleted successfully" };
  // }
}

module.exports = new ProductDiscountService();

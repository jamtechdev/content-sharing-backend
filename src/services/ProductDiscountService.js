const ProductDiscountRepository = require("../repositories/ProductDiscountRepository");
const ProductRepository = require('../repositories/ProductRepository')
const HttpError = require("../decorators/HttpError");

class ProductDiscountService {
  async createProductDiscount(data) {
    const product = await ProductRepository.getById(data.product_id)
    if(!product){
      throw new HttpError(404, "Product not found")
    }
    return await ProductDiscountRepository.create(data);
  }

  async getAllProductDiscounts() {
    const discounts = await ProductDiscountRepository.getAll();
    if (discounts.length === 0) {
      throw new HttpError(404, "No product discounts found");
    }
    return discounts;
  }

  async getProductDiscountById(discountId) {
    const discount = await ProductDiscountRepository.getById(discountId);
    if (!discount) {
      throw new HttpError(404, "Product discount not found");
    }
    return discount;
  }

  async getProductDiscountsByProductId(productId) {
    const discounts = await ProductDiscountRepository.getByProductId(productId);
    if (discounts.length === 0) {
      throw new HttpError(404, "No discounts found for this product");
    }
    return discounts;
  }

  async getActiveProductDiscounts(productId) {
    const discounts = await ProductDiscountRepository.getActiveDiscounts(productId);
    if (discounts.length === 0) {
      throw new HttpError(404, "No active discounts found for this product");
    }
    return discounts;
  }

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

  async deleteDiscountsByProductId(productId) {
    const discounts = await ProductDiscountRepository.getByProductId(productId);
    if (discounts.length === 0) {
      throw new HttpError(404, "No discounts found for this product");
    }
    await ProductDiscountRepository.deleteByProductId(productId);
    return { message: "All product discounts deleted successfully" };
  }
}

module.exports = new ProductDiscountService();

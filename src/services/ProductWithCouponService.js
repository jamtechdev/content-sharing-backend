const ProductWithCouponRepository = require("../repositories/ProductWithCouponRepository");
const HttpError = require("../decorators/HttpError");

class ProductWithCouponService {
  async createProductWithCoupon(data) {
    return await ProductWithCouponRepository.create(data);
  }

  async bulkCreateProductWithCoupon(dataArray) {
    return await ProductWithCouponRepository.bulkCreate(dataArray);
  }

  async getAllProductsWithCoupons() {
    const productsWithCoupons = await ProductWithCouponRepository.getAll();
    if (productsWithCoupons.length === 0) {
      throw new HttpError(404, "No products with coupons found");
    }
    return productsWithCoupons;
  }

  async getProductWithCouponById(id) {
    const productWithCoupon = await ProductWithCouponRepository.getById(id);
    if (!productWithCoupon) {
      throw new HttpError(404, "Product with coupon not found");
    }
    return productWithCoupon;
  }

  async getProductsByCouponId(couponId) {
    const products = await ProductWithCouponRepository.getByCouponId(couponId);
    if (products.length === 0) {
      throw new HttpError(404, "No products found for this coupon");
    }
    return products;
  }

  async getCouponsByProductId(productId) {
    const coupons = await ProductWithCouponRepository.getByProductId(productId);
    if (coupons.length === 0) {
      throw new HttpError(404, "No coupons found for this product");
    }
    return coupons;
  }

  async updateProductWithCoupon(id, data) {
    const productWithCoupon = await ProductWithCouponRepository.getById(id);
    if (!productWithCoupon) {
      throw new HttpError(404, "Product with coupon not found");
    }
    await ProductWithCouponRepository.update(id, data);
    return await ProductWithCouponRepository.getById(id);
  }

  async deleteProductWithCoupon(id) {
    const productWithCoupon = await ProductWithCouponRepository.getById(id);
    if (!productWithCoupon) {
      throw new HttpError(404, "Product with coupon not found");
    }
    return await ProductWithCouponRepository.delete(id);
  }

  async deleteByProductId(productId) {
    return await ProductWithCouponRepository.deleteByProductId(productId);
  }

  async deleteByCouponId(couponId) {
    return await ProductWithCouponRepository.deleteByCouponId(couponId);
  }
}

module.exports = new ProductWithCouponService();

const ProductCouponsRepository = require("../../repositories/ProductRepository/ProductCouponsRepository");
const HttpError = require("../../decorators/HttpError");

class ProductCouponService {
  async createProductCoupon(data) {
    const {usage_limit, max_usage_per_user}= data
    if(max_usage_per_user > usage_limit){
      return {code: 400, message: "User usage limit can't greater than usage limit"}
    }
    const existingCoupon = await ProductCouponsRepository.getByCode(data.code);
    if (existingCoupon) {
      return {code: 409, message: "Coupon code already exists"}
    }
    return await ProductCouponsRepository.create(data);
  }
  
  async getAllProductCoupons() {
    const coupons = await ProductCouponsRepository.getAll();
    if (coupons.length === 0) {
      return { code: 404, message: "No product coupons found"}
    }
    return coupons;
  }

  async getProductCouponById(couponId) {
    const coupon = await ProductCouponsRepository.getById(couponId);
    if (!coupon) {
      return { code: 404, message: "No product coupon found"}
    }
    return coupon;
  }

  async getProductCouponByCode(code) {
    const coupon = await ProductCouponsRepository.getByCode(code);
    if (!coupon) {
      return { code: 404, message: "No product coupon found"}
    }
    return coupon;
  }

  async getActiveCoupons() {
    const coupons = await ProductCouponsRepository.getActiveCoupons();
    if (coupons.length === 0) {
      return {code: 404, message: "No active coupons available"};
    }
    return coupons;
  }

  async updateProductCoupon(couponId, data) {
    const coupon = await ProductCouponsRepository.getById(couponId);
    if (!coupon) {
      return {code: 404, message: "Product coupon not found"};
    }
    
    await ProductCouponsRepository.update(couponId, data);
    return await ProductCouponsRepository.getById(couponId);
  }

  async deleteProductCoupon(couponId) {
    const coupon = await ProductCouponsRepository.getById(couponId);
    if (!coupon) {
      return {code: 404, message: "Product coupon not found"};
    }
    return await ProductCouponsRepository.delete(couponId);
  }
}

module.exports = new ProductCouponService();
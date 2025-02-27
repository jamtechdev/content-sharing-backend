const ProductCouponsRepository = require("../../repositories/ProductRepository/ProductCouponsRepository");
const HttpError = require("../../decorators/HttpError");

class ProductCouponService {
  async createProductCoupon(data) {
    let {start_date, end_date} = data
    if (!data.code || !data.discount_type || !data.discount_value) {
      throw new HttpError(400, "Coupon code, discount type, and discount value are required");
    }
    
    const existingCoupon = await ProductCouponsRepository.getByCode(data.code);
    if (existingCoupon) {
      throw new HttpError(409, "A coupon with this code already exists");
    }
    // const startDate = new Date(start_date)
    // const endDate = new Date(end_date)
    // data.start_date = startDate
    // data.end_date = endDate
    return await ProductCouponsRepository.create(data);
  }
  
  async getAllProductCoupons() {
    const coupons = await ProductCouponsRepository.getAll();
    if (coupons.length === 0) {
      throw new HttpError(404, "No product coupons found");
    }
    return coupons;
  }

  async getProductCouponById(couponId) {
    const coupon = await ProductCouponsRepository.getById(couponId);
    if (!coupon) {
      throw new HttpError(404, "Product coupon not found");
    }
    return coupon;
  }

  async getProductCouponByCode(code) {
    const coupon = await ProductCouponsRepository.getByCode(code);
    if (!coupon) {
      throw new HttpError(404, "Product coupon not found");
    }
    return coupon;
  }

  async getActiveCoupons() {
    const coupons = await ProductCouponsRepository.getActiveCoupons();
    if (coupons.length === 0) {
      throw new HttpError(404, "No active coupons available");
    }
    return coupons;
  }

  async updateProductCoupon(couponId, data) {
    const coupon = await ProductCouponsRepository.getById(couponId);
    if (!coupon) {
      throw new HttpError(404, "Product coupon not found");
    }
    
    await ProductCouponsRepository.update(couponId, data);
    return await ProductCouponsRepository.getById(couponId);
  }

  async deleteProductCoupon(couponId) {
    const coupon = await ProductCouponsRepository.getById(couponId);
    if (!coupon) {
      throw new HttpError(404, "Product coupon not found");
    }
    return await ProductCouponsRepository.delete(couponId);
  }
}

module.exports = new ProductCouponService();
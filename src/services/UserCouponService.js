const UserCouponRepository = require("../repositories/UserCouponRepository");
const ProductCouponsRepository = require('../repositories/ProductRepository/ProductCouponsRepository')
const HttpError = require("../decorators/HttpError");

class UserCouponService {
  async createUserCoupon(data, userId) {
    data.user_id = userId
    const coupon = await ProductCouponsRepository.getById(data.coupon_id)
    if(!coupon){
      throw new HttpError(404, "Coupon not found")
    }
    const userCouponExist = await UserCouponRepository.getUserSpecificCoupon(userId, data.coupon_id)
    if(userCouponExist){
      throw new HttpError(409, "User already have this coupon")
    }
    return await UserCouponRepository.create(data);
  }

  async getAllCoupons(){
    const coupons = await UserCouponRepository.getAll()
    if(coupons.length === 0){
      throw new HttpError(404, "Coupons not found")
    }
    return coupons
  }

  async getUserCouponById(id) {
    const userCoupon = await UserCouponRepository.getById(id);
    if (!userCoupon) {
      throw new HttpError(404, "User coupon not found");
    }
    return userCoupon;
  }

  async getUserCouponsByUserId(userId) {
    const userCoupons = await UserCouponRepository.getByUserId(userId);
    if (userCoupons.length === 0) {
      throw new HttpError(404, "No coupons found for this user");
    }
    return userCoupons;
  }

  async getUserCouponsByCouponId(couponId) {
    const userCoupons = await UserCouponRepository.getByCouponId(couponId);
    if (userCoupons.length === 0) {
      throw new HttpError(404, "User coupon not found");
    }
    return userCoupons;
  }

  async getUserSpecificCoupon(userId, couponId) {
    const userCoupon = await UserCouponRepository.getSpecificCoupon(userId, couponId);
    if (!userCoupon) {
      throw new HttpError(404, "User coupon not found");
    }
    return userCoupon;
  }

  async updateUserCoupon(data) {
    const userCoupon = await UserCouponRepository.getById(data.id);
    if (!userCoupon) {
      throw new HttpError(404, "User coupon not found");
    }
    return await UserCouponRepository.update(data);
  }

  async deleteUserCoupon(id) {
    const userCoupon = await UserCouponRepository.getById(id);
    if (!userCoupon) {
      throw new HttpError(404, "User coupon not found");
    }
    return await UserCouponRepository.delete(id);
  }

  async deleteUserCouponsByUserId(userId) {
    return await UserCouponRepository.deleteByUserId(userId);
  }

  async deleteUserCouponsByCouponId(couponId) {
    return await UserCouponRepository.deleteByCouponId(couponId);
  }
}

module.exports = new UserCouponService();

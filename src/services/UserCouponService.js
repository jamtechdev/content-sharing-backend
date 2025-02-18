const UserCouponRepository = require("../repositories/UserCouponRepository");
const HttpError = require("../decorators/HttpError");

class UserCouponService {
  async createUserCoupon(data) {
    return await UserCouponRepository.create(data);
  }

  async bulkCreateUserCoupons(dataArray) {
    return await UserCouponRepository.bulkCreate(dataArray);
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
      throw new HttpError(404, "No users found for this coupon");
    }
    return userCoupons;
  }

  async getUserCoupon(userId, couponId) {
    const userCoupon = await UserCouponRepository.getUserCoupon(userId, couponId);
    if (!userCoupon) {
      throw new HttpError(404, "User coupon not found");
    }
    return userCoupon;
  }

  async updateUserCoupon(id, data) {
    const userCoupon = await UserCouponRepository.getById(id);
    if (!userCoupon) {
      throw new HttpError(404, "User coupon not found");
    }
    return await UserCouponRepository.update(id, data);
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

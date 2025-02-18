const db = require("../models");
const UserCoupon = db.user_coupon

class UserCouponRepository {
  async create(data) {
    return await UserCoupon.create(data);
  }

  async bulkCreate(dataArray) {
    return await UserCoupon.bulkCreate(dataArray);
  }

  async getById(id) {
    return await UserCoupon.findByPk(id);
  }

  async getByUserId(userId) {
    return await UserCoupon.findAll({ where: { user_id: userId } });
  }

  async getByCouponId(couponId) {
    return await UserCoupon.findAll({ where: { coupon_id: couponId } });
  }

  async getUserCoupon(userId, couponId) {
    return await UserCoupon.findOne({ where: { user_id: userId, coupon_id: couponId } });
  }

  async update(id, data) {
    await UserCoupon.update(data, { where: { id } });
    return await this.getById(id);
  }

  async delete(id) {
    return await UserCoupon.destroy({ where: { id } });
  }

  async deleteByUserId(userId) {
    return await UserCoupon.destroy({ where: { user_id: userId } });
  }

  async deleteByCouponId(couponId) {
    return await UserCoupon.destroy({ where: { coupon_id: couponId } });
  }
}

module.exports = new UserCouponRepository();

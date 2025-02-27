const db = require("../models");
const UserCoupon = db.user_coupon;
const User = db.users;
const ProductCoupon = db.product_coupon;

class UserCouponRepository {
  async create(data) {
    return await UserCoupon.create(data);
  }

  async getAll() {
    return await UserCoupon.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getById(id) {
    return await UserCoupon.findOne({where: {id},
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getByUserId(userId) {
    return await UserCoupon.findAll({ where: { user_id: userId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getByCouponId(couponId) {
    return await UserCoupon.findAll({ where: { coupon_id: couponId }, 
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async getSpecificCoupon(userId, couponId) {
    return await UserCoupon.findOne({
      where: { user_id: userId, coupon_id: couponId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductCoupon,
          as: "coupon",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
  }

  async update(data) {
    await UserCoupon.update(data, { where: { id: data.id } });
    return await this.getById(data.id);
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

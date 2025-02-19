const db = require("../../models");
const ProductWithCoupon = db.product_with_coupon

class ProductWithCouponRepository {
  async create(data) {
    return await ProductWithCoupon.create(data);
  }

  async bulkCreate(dataArray) {
    return await ProductWithCoupon.bulkCreate(dataArray);
  }

  async getAll() {
    return await ProductWithCoupon.findAll();
  }

  async getById(id) {
    return await ProductWithCoupon.findByPk(id);
  }

  async getByProductId(productId) {
    return await ProductWithCoupon.findAll({
      where: { product_id: productId },
    });
  }

  async getByCouponId(couponId) {
    return await ProductWithCoupon.findAll({
      where: { coupon_id: couponId },
    });
  }

  async update(id, data) {
    return await ProductWithCoupon.update(data, {
      where: { id },
    });
  }

  async delete(id) {
    return await ProductWithCoupon.destroy({
      where: { id },
    });
  }

  async deleteByProductId(productId) {
    return await ProductWithCoupon.destroy({
      where: { product_id: productId },
    });
  }

  async deleteByCouponId(couponId) {
    return await ProductWithCoupon.destroy({
      where: { coupon_id: couponId },
    });
  }
}

module.exports = new ProductWithCouponRepository();

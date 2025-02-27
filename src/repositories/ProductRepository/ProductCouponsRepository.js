const db = require("../../models/index");
const ProductCoupon = db.product_coupon;

class ProductCouponsRepository {
  async create(data) {
    return await ProductCoupon.create(data);
  }

  async getAll() {
    return await ProductCoupon.findAll();
  }

  async getById(couponId) {
    return await ProductCoupon.findOne({where: {id: couponId }});
  }

  async getByCode(code) {
    return await ProductCoupon.findOne({ where: { code } });
  }

  async getActiveCoupons() {
    const currentDate = new Date()
    return await ProductCoupon.findAll({
      where: {
        start_date: { [db.Sequelize.Op.lte]: currentDate },
        end_date: { [db.Sequelize.Op.gte]: currentDate },
      },
    });
  }

  async update(couponId, data) {
    return await ProductCoupon.update(data, { where: { id: couponId } });
  }

  async delete(couponId) {
    return await ProductCoupon.destroy({ where: { id: couponId } });
  }
}

module.exports = new ProductCouponsRepository();

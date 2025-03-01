const db = require("../../models");

const ProductOrder = db.product_order;
const ProductCoupon = db.product_coupon;

class ProductOrderRepository {
  async create(data) {
    return await ProductOrder.create(data);
  }

  async getAll(userId) {
    return await ProductOrder.findAll({
      where: {
        user_id: userId,
      },
      attributes: {exclude: ["createdAt", "updatedAt"]},
      include: [{
        model: ProductCoupon,
        as: "coupon",
        attributes: {exclude: ["createdAt", "updatedAt"]}
      }]
    });
  }

  async getById(id) {
    return await ProductOrder.findOne({
      where: { id },
    });
  }

  async updateById(data) {
    return await ProductOrder.update(data, {
      where: {
        id: data.id,
      },
    });
  }

  async deleteById(id) {
    return await ProductOrder.destroy({
      where: { id },
    });
  }
}
module.exports = new ProductOrderRepository();

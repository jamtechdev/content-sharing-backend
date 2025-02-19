const db = require("../../models/index");
const ProductDiscount = db.product_discount;
const Product = db.product

class ProductDiscountRepository {
  async create(data) {
    return await ProductDiscount.create(data);
  }

  async getAll() {
    return await ProductDiscount.findAll({include: [{model: Product, as: "product"}]});
  }

  async getById(discountId) {
    return await ProductDiscount.findOne({ where: { id: discountId } });
  }

  async getByProductId(productId) {
    return await ProductDiscount.findAll({ where: { product_id: productId } });
  }

  async getActiveDiscounts(productId) {
    const currentDate = new Date();
    return await ProductDiscount.findAll({
      where: {
        product_id: productId,
        start_date: { [db.Sequelize.Op.lte]: currentDate },
        end_date: { [db.Sequelize.Op.gte]: currentDate },
      },
    });
  }

  async update(discountId, data) {
    return await ProductDiscount.update(data, { where: { id: discountId } });
  }

  async delete(discountId) {
    return await ProductDiscount.destroy({ where: { id: discountId } });
  }

  async deleteByProductId(productId) {
    return await ProductDiscount.destroy({ where: { product_id: productId } });
  }
}

module.exports = new ProductDiscountRepository();

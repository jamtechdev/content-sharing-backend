const db = require("../../models/index");
const ProductAttribute = db.product_attribute;

class ProductAttributeRepository {
  async create(data) {
    return await ProductAttribute.create(data);
  }

  async bulkCreate(data) {
    return await ProductAttribute.bulkCreate(data);
  }

  async getAll() {
    return await ProductAttribute.findAll();
  }

  async getById(attributeId) {
    return await ProductAttribute.findOne({ where: { id: attributeId } });
  }

  async getByProductId(productId) {
    return await ProductAttribute.findAll({ where: { product_id: productId } });
  }

  async update(attributeId, data) {
    return await ProductAttribute.update(data, { where: { id: attributeId } });
  }

  async delete(attributeId) {
    return await ProductAttribute.destroy({ where: { id: attributeId } });
  }

  async deleteByProductId(productId) {
    return await ProductAttribute.destroy({ where: { product_id: productId } });
  }
}

module.exports = new ProductAttributeRepository();
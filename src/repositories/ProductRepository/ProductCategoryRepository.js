const db = require("../../models/index");
const ProductCategory = db.product_category;
const Product = db.product;
const HttpError = require('../../decorators/HttpError')

class ProductCategoryRepository {
  async create(data) {
    const productCategory = await ProductCategory.create(data);
    return productCategory;
  }

  async getAll() {
    const productCategories = await ProductCategory.findAll({
      include: [{
        model: Product,
        as: "product"
      }]
    });
    return productCategories;
  }

  async getById(categoryId) {
    const productCategory = await ProductCategory.findOne({where: {id: categoryId}});
    return productCategory;
  }

  async update(categoryId, data) {
    await ProductCategory.update(data, {
      where: { id: categoryId },
    });
    const updatedProductCategory = await ProductCategory.findByPk(categoryId);
    return updatedProductCategory;
  }

  async delete(categoryId) {
    const deleted = await ProductCategory.destroy({
      where: { id: categoryId },
    });
    return deleted;
  }

  async getByName(name) {
    const productCategory = await ProductCategory.findOne({
      where: { name },
    });
    return productCategory;
  }
}

module.exports = new ProductCategoryRepository();

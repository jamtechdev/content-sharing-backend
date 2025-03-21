const ProductCategoryRepository = require("../../repositories/ProductRepository/ProductCategoryRepository");
const HttpError = require("../../decorators/HttpError");

class ProductCategoryService {
  async createProductCategory(data) {
    const existingCategory = await ProductCategoryRepository.getByName(
      data.name
    );
    if (existingCategory) {
      return {status: 409, message: "Product category with this name already exists"}
    }
    const productCategory = await ProductCategoryRepository.create(data);
    return productCategory;
  }

  async getAllProductCategories() {
    const productCategories = await ProductCategoryRepository.getAll();
    return productCategories;
  }

  async getProductCategoryById(categoryId) {
    const productCategory = await ProductCategoryRepository.getById(categoryId);
    return productCategory;
  }

  async updateProductCategory(categoryId, data) {
    const productCategory = await ProductCategoryRepository.getById(categoryId);
    if (!productCategory) {
      return {code: "ERR404", message: "Product category not found"}
    }
    const updatedProductCategory = await ProductCategoryRepository.update(
      categoryId,
      data
    );
    return updatedProductCategory;
  }

  async deleteProductCategory(categoryId) {
    const productCategory = await ProductCategoryRepository.getById(categoryId);
    if (!productCategory) {
      return {code: "ERR404", message: "Product category not found"}
    }
    const deleted = await ProductCategoryRepository.delete(categoryId);
    return deleted;
  }

  // async getProductCategoryByName(name) {
  //   const productCategory = await ProductCategoryRepository.getByName(name);
  //   if (!productCategory) {
  //     throw new HttpError(404, "Product category not found");
  //   }
  //   return productCategory;
  // }
}

module.exports = new ProductCategoryService();

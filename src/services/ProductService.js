const ProductRepository = require("../repositories/ProductRepository");
const HttpError = require("../decorators/HttpError");

class ProductService {
  async createProduct(data) {
    const slug_exist = await ProductRepository.getBySlug(data.slug);
    if (slug_exist) {
      throw new HttpError(409, "Slug is already exists");
    }
    console.log('data', data)
    return await ProductRepository.create(data)
  }

  async getAllPublishedProducts() {
    const products = await ProductRepository.getAll();
    if (products.length === 0) {
      throw new HttpError(404, "Products not found");
    }
    return products;
  }

  async getProductById(productId) {
    const product = await ProductRepository.getById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    return product;
  }

  async getProductBySlug(slug) {
    const product = await ProductRepository.getBySlug(slug);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    return product;
  }

  async getProductsByRegionId(regionId) {
    const products = await ProductRepository.getByRegionId(regionId);
    if (products.length === 0) {
      throw new HttpError(404, "Products not found");
    }
    return products;
  }

  async getProductsByCategoryId(categoryId) {
    const products = await ProductRepository.getByCategoryId(categoryId);
    if (products.length === 0) {
      throw new HttpError(404, "Products not found");
    }
    return products;
  }

  async getProductsByTag(tag) {
    const products = await ProductRepository.getByTag(tag);
    if (products.length === 0) {
      throw new HttpError(404, "Products not found");
    }
    return products;
  }

  async searchProductsByName(name) {
    const products = await ProductRepository.getByName(name);
    if (products.length === 0) {
      throw new HttpError(404, "Products not found");
    }
    return products;
  }

  async updateProduct(productId, data) {
    const product = await ProductRepository.getById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    const updatedProduct = await ProductRepository.update(productId, data);
    if (!updatedProduct[0]) {
      throw new Error("Product not found or no changes made");
    }
    return updatedProduct;
  }

  async deleteProduct(productId) {
    const product = await ProductRepository.getById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found or already deleted");
    }
    const deletedProduct = await ProductRepository.delete(productId);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return deletedProduct;
  }
}

module.exports = new ProductService();

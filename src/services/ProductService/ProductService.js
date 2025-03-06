const ProductRepository = require("../../repositories/ProductRepository/ProductRepository");
const HttpError = require("../../decorators/HttpError");
const {generateSlug} = require('../../utils/generateSlug')
class ProductService {
  async createProduct(data) {
    const {
      category_id,
      name,
      description,
      short_description,
      price,
      sale_price,
      sku,
      slug,
      type,
      unique,
      stock_quantity,
      is_featured,
      status,
      // attributes,
      tags,
      region_id,
    } = data
    let uniqueSlug = generateSlug(name)
    let slug_exist = await ProductRepository.getBySlug(uniqueSlug);
    let counter = 1

    while(slug_exist){
      uniqueSlug = `${uniqueSlug}${counter}`
      slug_exist = await ProductRepository.getBySlug(uniqueSlug)
      counter++;
    }
    
    return await ProductRepository.create({
      category_id,
      name,
      description,
      short_description,
      price,
      sale_price,
      sku,
      slug: uniqueSlug,
      type,
      unique,
      stock_quantity,
      is_featured,
      status,
      // attributes: JSON.stringify(attributes),
      tags: JSON.stringify(tags),
      region_id,
    })
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

  // async getProductsByTag(tag) {
  //   const products = await ProductRepository.getByTag(tag);
  //   if (products.length === 0) {
  //     throw new HttpError(404, "Products not found");
  //   }
  //   return products;
  // }

  async searchProduct(search) {
    const products = await ProductRepository.searchProduct(search);
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

const ProductRepository = require("../../repositories/ProductRepository/ProductRepository");
const HttpError = require("../../decorators/HttpError");
const ProductAttributeRepository = require('../../repositories/ProductRepository/ProductAttributeRepository')
const ProductDiscountRepository = require('../../repositories/ProductRepository/ProductDiscountRepository')
const ProductMediaRepository = require('../../repositories/ProductRepository/ProductMediaRepository')
const ProductOffersRepository = require('../../repositories/ProductRepository/ProductOfferRepository')
const ProductSEORepository = require('../../repositories/ProductRepository/ProductSEORepository')
const ProductWithCouponRepository = require('../../repositories/ProductRepository/ProductWithCouponRepository');
const OrderItemsRepository = require('../../repositories/ProductRepository/OrderItemsRepository')
const db = require('../../models/index')
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
      uniqueSlug = `${generateSlug(name)}-${counter}`
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
    return products;
  }

  async getProductById(productId) {
    const product = await ProductRepository.getById(productId);
    return product;
  }

  async getProductBySlug(slug) {
    const product = await ProductRepository.getBySlug(slug);
    return product;
  }

  async getProductsByRegionId(regionId) {
    const products = await ProductRepository.getByRegionId(regionId);
    return products;
  }

  async getProductsByCategoryId(categoryId) {
    const products = await ProductRepository.getByCategoryId(categoryId);
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
    return products;
  }

  async updateProduct(productId, data) {
    const product = await ProductRepository.getById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    if(data.name){
      let uniqueSlug = generateSlug(data.name)
      let slug_exist = await ProductRepository.getBySlug(uniqueSlug);
      let counter = 1
  
      while(slug_exist){
        uniqueSlug = `${generateSlug(data.name)}-${counter}`
        slug_exist = await ProductRepository.getBySlug(uniqueSlug)
        counter++;
      }
      data.slug = uniqueSlug
    }
    const updatedProduct = await ProductRepository.update(productId, data);
    if (!updatedProduct[0]) {
      throw new Error("Product not found or no changes made");
    }
    return updatedProduct;
  }

  async deleteProduct(productId) {
    try {
      const transaction = await db.sequelize.transaction();
    const product = await ProductRepository.getById(productId);
    if (!product) {
      return {code: 404, message: "Product not found or already deleted"}
    }
    const deletedProduct = await ProductRepository.delete(productId);
    if (!deletedProduct) {
      return {code: 404, message: "Product not found"}
    }
    await ProductAttributeRepository.deleteByProductId(productId, {transaction});
    await ProductDiscountRepository.deleteByProductId(productId, {transaction});
    await ProductMediaRepository.deleteByProductId(productId, {transaction});
    await ProductOffersRepository.deleteByProductId(productId, {transaction});
    await ProductSEORepository.deleteByProductId(productId, {transaction});
    await ProductWithCouponRepository.deleteByProductId(productId, {transaction});
    await OrderItemsRepository.deleteByProductId(productId, {transaction});
    
    // Commit the transaction
    await transaction.commit();

    return deletedProduct;
  }catch (error) {
      // If any error occurs, rollback the transaction
    await transaction.rollback();
    throw error;
    }
}
}
module.exports = new ProductService();

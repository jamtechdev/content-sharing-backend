const ProductAttributeRepository = require("../../repositories/ProductRepository/ProductAttributeRepository");
const ProductRepository = require('../../repositories/ProductRepository/ProductRepository')
const HttpError = require("../../decorators/HttpError");

class ProductAttributeService {
  async createProductAttribute(data) {
    const product = await ProductRepository.getById(data.product_id)
    if(!product){
      throw new HttpError(404, "Product not found")
    }
    // let {key, value} = data
    // if(Array.isArray(value)){
    //   data.value = JSON.stringify(value) 
    // }

    return await ProductAttributeRepository.create(data);
  }

  async bulkCreateProductAttributes(data) {
    return await ProductAttributeRepository.bulkCreate(data);
  }

  async getAllProductAttributes() {
    const attributes = await ProductAttributeRepository.getAll();
    if (attributes.length === 0) {
      throw new HttpError(404, "No product attributes found");
    }
    return attributes;
  }

  async getProductAttributeById(attributeId) {
    const attribute = await ProductAttributeRepository.getById(attributeId);
    if (!attribute) {
      throw new HttpError(404, "Product attribute not found");
    }
    return attribute;
  }

  async getProductAttributesByProductId(productId) {
    const attributes = await ProductAttributeRepository.getByProductId(productId);
    if (attributes.length === 0) {
      throw new HttpError(404, "No attributes found for this product");
    }
    return attributes;
  }

  async updateProductAttribute(attributeId, data) {
    const attribute = await ProductAttributeRepository.getById(attributeId);
    if (!attribute) {
      throw new HttpError(404, "Product attribute not found");
    }
    await ProductAttributeRepository.update(attributeId, data);
    return { message: "Product attribute updated successfully" };
  }

  async deleteProductAttribute(attributeId) {
    const attribute = await ProductAttributeRepository.getById(attributeId);
    if (!attribute) {
      throw new HttpError(404, "Product attribute not found");
    }
    await ProductAttributeRepository.delete(attributeId);
    return { message: "Product attribute deleted successfully" };
  }

  async deleteAttributesByProductId(productId) {
    const attributes = await ProductAttributeRepository.getByProductId(productId);
    if (attributes.length === 0) {
      throw new HttpError(404, "No attributes found for this product");
    }
    await ProductAttributeRepository.deleteByProductId(productId);
    return { message: "All product attributes deleted successfully" };
  }
}

module.exports = new ProductAttributeService();

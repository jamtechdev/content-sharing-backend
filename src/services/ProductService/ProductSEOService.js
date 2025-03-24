const ProductSEORepository = require("../../repositories/ProductRepository/ProductSEORepository");
const ProductRepository = require("../../repositories/ProductRepository/ProductRepository");
const HttpError = require("../../decorators/HttpError");

class ProductSEOService {
  async createProductSEO(data) {
    const product = await ProductRepository.getById(data.product_id);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    const productSEOExist = await ProductSEORepository.getByProductId(
      data.product_id
    );
    if (productSEOExist) {
      throw new HttpError(409, "SEO for this product already exist");
    }
    data.meta_keywords = JSON.stringify(data.meta_keywords)
    return await ProductSEORepository.create(data);
  }

  async getAllSEO() {
    const response = await ProductSEORepository.getAll();
    if (response.length === 0) {
      throw new HttpError(404, "SEO not found");
    }
    for(let item of response){
      if (Array.isArray(JSON.parse(item.meta_keywords))) {
        item.meta_keywords = JSON.parse(item.meta_keywords).join(", ");
      }
    }
    return response;
  }

  async getSEOById(id) {
    const response = await ProductSEORepository.getById(id);
    if (!response) {
      throw new HttpError(404, "SEO not found");
    }
    return response;
  }

  // async getSEOByProductId(id) {
  //   const response = await ProductSEORepository.getByProductId(id);
  //   if (!response) {
  //     throw new HttpError(404, "SEO not found");
  //   }
  //   return response;
  // }

  // async searchSEOByTitle(search) {
  //   const response = await ProductSEORepository.searchByTitle(search);
  //   if (response.length === 0) {
  //     throw new HttpError(404, "SEO not found");
  //   }
  //   return response;
  // }

  // async searchSEOByKeywords(search) {
  //   const response = await ProductSEORepository.searchByKeywords(search);
  //   if (response.length === 0) {
  //     throw new HttpError(404, "SEO not found");
  //   }
  //   return response;
  // }

  async updateSEOById(data) {
    const { id, product_id } = data;
    const response = await ProductSEORepository.getById(id);
    if (!response) {
      throw new HttpError(404, "Product SEO not found");
    }
    const product = await ProductRepository.getById(product_id);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    return await ProductSEORepository.update(data);
  }

  async deleteBySEOId(id) {
    const response = await ProductSEORepository.getById(id);
    if (!response) {
      throw new HttpError(404, "Product SEO not found");
    }
    return await ProductSEORepository.deleteById(id);
  }

  // async deleteSEOByProductId(id) {
  //   const product = await ProductRepository.getById(id);
  //   if (!product) {
  //     throw new HttpError(404, "Product not found");
  //   }
  //   const response = await ProductSEORepository.getById(id);
  //   if (!response) {
  //     throw new HttpError(404, "Product SEO not found");
  //   }
  //   return await ProductSEORepository.deleteByProductId(id);
  // }
}

module.exports = new ProductSEOService();

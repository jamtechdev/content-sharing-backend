const ProductMediaRepository = require("../../repositories/ProductRepository/ProductMediaRepository");
const ProductRepository = require("../../repositories/ProductRepository/ProductRepository");
const HttpError = require("../../decorators/HttpError");
const {cloudinaryImageUpload} = require('../../utils/cloudinaryService');


class ProductMediaService {
  async createProductMedia(file, data) {
    const product = await ProductRepository.getById(data.product_id)
    if(!product){
      throw new HttpError(404, "Product not found")
    }
    if(!file){
      throw new HttpError(400, "Media file is required")
    }
    const {secureUrl, resourceType} = await cloudinaryImageUpload(file.path)
    const {
      product_id,
      is_main,
      is_gallery,
    } = data;
    return await ProductMediaRepository.create({
      product_id,
      media_type: resourceType,
      file_url: secureUrl,
      file_name: file.filename,
      file_size: file.size,
      file_extension: "."+(file.mimetype).split("/")[1],
      is_main,
      is_gallery,
    });
  }

  async getAllProductMedia() {
    const media = await ProductMediaRepository.getAll();
    if (media.length === 0) {
      throw new HttpError(404, "No product media found");
    }
    return media;
  }

  async getProductMediaById(mediaId) {
    const media = await ProductMediaRepository.getById(mediaId);
    if (!media) {
      throw new HttpError(404, "Product media not found");
    }
    return media;
  }

  async getProductMediaByProductId(productId) {
    const media = await ProductMediaRepository.getByProductId(productId);
    if (media.length === 0) {
      throw new HttpError(404, "No media found for this product");
    }
    return media;
  }

  async getMainProductMedia(productId) {
    const media = await ProductMediaRepository.getMainMediaByProductId(
      productId
    );
    if (!media) {
      throw new HttpError(404, "Main product media not found");
    }
    return media;
  }

  async getGalleryProductMedia(productId) {
    const media = await ProductMediaRepository.getGalleryByProductId(productId);
    if (media.length === 0) {
      throw new HttpError(404, "No gallery media found for this product");
    }
    return media;
  }

  async updateProductMedia(mediaId, file, data) {
    const media = await ProductMediaRepository.getById(mediaId);
    if (!media) {
      throw new HttpError(404, "Product media not found");
    }
    const {
      product_id,
      is_main,
      is_gallery,
    } = data
    const {secureUrl, resourceType} = await cloudinaryImageUpload(file.path)

    const updatedMedia = await ProductMediaRepository.update(mediaId, {
      product_id,
      media_type: resourceType,
      file_url: secureUrl,
      file_name: file.filename,
      file_size: file.size,
      file_extension: "."+(file.mimetype).split("/")[1],
      is_main,
      is_gallery,
    });
    return updatedMedia;
  }

  async deleteProductMedia(mediaId) {
    const media = await ProductMediaRepository.getById(mediaId);
    if (!media) {
      throw new HttpError(404, "Product media not found");
    }
    await ProductMediaRepository.delete(mediaId);
    return { message: "Product media deleted successfully" };
  }

  async deleteMediaByProductId(productId) {
    const media = await ProductMediaRepository.getByProductId(productId);
    if (media.length === 0) {
      throw new HttpError(404, "No media found for this product");
    }
    await ProductMediaRepository.deleteByProductId(productId);
    return { message: "All media for the product deleted successfully" };
  }
}

module.exports = new ProductMediaService();

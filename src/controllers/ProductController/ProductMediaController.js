const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductMediaService = require("../../services/ProductService/ProductMediaService");
const {upload} = require('../../utils/MulterConfig')

class ProductMediaController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-media",
      authenticate,
      // authorize("admin"),
      upload.single('mediaFile'),
      TryCatch(this.createProductMedia.bind(this))
    );

    // this.router.addRoute(
    //   "get",
    //   "/",
    //   authenticate,
    //   // authorize("admin"),
    //   TryCatch(this.getAllProductMedia.bind(this))
    // );

    // this.router.addRoute(
    //   "get",
    //   "/:id",
    //   authenticate,
    //   // authorize("admin"),
    //   TryCatch(this.getProductMediaById.bind(this))
    // );

    // this.router.addRoute(
    //   "get",
    //   "/product/:productId",
    //   authenticate,
    //   // authorize("admin"),
    //   TryCatch(this.getProductMediaByProductId.bind(this))
    // );

    // this.router.addRoute(
    //   "get",
    //   "/product/:productId/main",
    //   authenticate,
    //   // authorize("admin"),
    //   TryCatch(this.getMainProductMedia.bind(this))
    // );

    // this.router.addRoute(
    //   "get",
    //   "/product/:productId/gallery",
    //   authenticate,
    //   // authorize("admin"),
    //   TryCatch(this.getGalleryProductMedia.bind(this))
    // );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      // authorize("admin"),
      upload.single("mediaFile"),
      TryCatch(this.updateProductMedia.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      // authorize("admin"),
      TryCatch(this.deleteProductMedia.bind(this))
    );

    // this.router.addRoute(
    //   "delete",
    //   "/product/:productId",
    //   authenticate,
    //   // authorize("admin"),
    //   TryCatch(this.deleteMediaByProductId.bind(this))
    // );
  }

  async createProductMedia(req, res) {
    const mediaData = req.body;
    const mediaFile = req?.file
    const newMedia = await ProductMediaService.createProductMedia(mediaFile, mediaData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product media created successfully",
      data: newMedia,
    });
  }

  // async getAllProductMedia(req, res) {
  //   const media = await ProductMediaService.getAllProductMedia();
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Product media fetched successfully",
  //     data: media,
  //   });
  // }

  // async getProductMediaById(req, res) {
  //   const mediaId = req.params.id;
  //   const media = await ProductMediaService.getProductMediaById(mediaId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Product media fetched successfully",
  //     data: media,
  //   });
  // }

  // async getProductMediaByProductId(req, res) {
  //   const productId = req.params.productId;
  //   const media = await ProductMediaService.getProductMediaByProductId(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Product media fetched successfully",
  //     data: media,
  //   });
  // }

  // async getMainProductMedia(req, res) {
  //   const productId = req.params.productId;
  //   const media = await ProductMediaService.getMainProductMedia(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Main product media fetched successfully",
  //     data: media,
  //   });
  // }

  // async getGalleryProductMedia(req, res) {
  //   const productId = req.params.productId;
  //   const media = await ProductMediaService.getGalleryProductMedia(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Gallery product media fetched successfully",
  //     data: media,
  //   });
  // }

  async updateProductMedia(req, res) {
    const updateData = req.body;
    const mediaFile = req?.file
    console.log(updateData.mediaId, mediaFile, updateData)
    const updatedMedia = await ProductMediaService.updateProductMedia(updateData.mediaId, mediaFile, updateData);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product media updated successfully",
      data: updatedMedia,
    });
  }

  async deleteProductMedia(req, res) {
    const mediaId = req.params.id;
    await ProductMediaService.deleteProductMedia(mediaId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product media deleted successfully",
    });
  }

  // async deleteMediaByProductId(req, res) {
  //   const productId = req.params.productId;
  //   await ProductMediaService.deleteMediaByProductId(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "All media for the product deleted successfully",
  //   });
  // }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductMediaController();

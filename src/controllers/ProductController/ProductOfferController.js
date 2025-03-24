const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductOfferService = require("../../services/ProductService/ProductOfferService");

class ProductOfferController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-offer",
      authenticate,
        authorize(["admin"]),
      TryCatch(this.createProductOffer.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
        authorize(["admin"]),
      TryCatch(this.getAllProductOffers.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      TryCatch(this.getProductOfferById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/product/:productId",
      authenticate,
      TryCatch(this.getProductOffersByProductId.bind(this))
    );

    this.router.addRoute(
      "get",
      "/product/:productId/active-offers",
      authenticate,
      TryCatch(this.getActiveOffers.bind(this))
    );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
        authorize(["admin"]),
      TryCatch(this.updateProductOffer.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
        authorize(["admin"]),
      TryCatch(this.deleteProductOffer.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/product/:productId",
      authenticate,
        authorize(["admin"]),
      TryCatch(this.deleteOffersByProductId.bind(this))
    );
  }

  async createProductOffer(req, res) {
    if (!req.body.product_id || !req.body.offer_type) {
      return res
      .status(400)
      .json({
        code: 400,
        success: false,
        message: "Missing required fields",
      });
    }
    const response = await ProductOfferService.createProductOffer(req.body);
    if(response.code=== 409){
      return res
      .status(response.code)
      .json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res
      .status(201)
      .json({
        code: 201,
        success: true,
        message: "Product offer created successfully",
        data: response,
      });
  }

  async getAllProductOffers(req, res) {
    const response = await ProductOfferService.getAllProductOffers();
    if(response.code=== 200){
      return res
      .status(response.code)
      .json({
        code: response.code,
        success: true,
        message: response.message
      });
    }
    res.status(200).json({code: 200, success: true, data: response });
  }

  async getProductOfferById(req, res) {
    const offerId = req.params.id;
    const response = await ProductOfferService.getProductOfferById(offerId);
    if(response.code === 200){
      return res.status(200).json({code: 200, success: true, message: response.message })
    }
    return res.status(200).json({code: 200, success: true, data: response });
  }

  async getProductOffersByProductId(req, res) {
    const productId = req.params.productId;
    const response = await ProductOfferService.getProductOffersByProductId(
      productId
    );
    if(response.code=== 404){
      return res
      .status(response.code)
      .json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({code: 200, success: true, data: response });
  }

  async getActiveOffers(req, res) {
    const productId = req.params.productId;
    const response = await ProductOfferService.getActiveOffers(
      productId
    );
    if(response.code=== 404){
      return res
      .status(response.code)
      .json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    res.status(200).json({code: 200, success: true, data: response });
  }

  async updateProductOffer(req, res) {
    const response = await ProductOfferService.updateProductOffer(
      req.body.offerId,
      req.body
    );
    if(response.code === 404 || response.code === 404){
      return res
      .status(response.code)
      .json({
        code: response.code, success: false,
        message: response.message,
      });
    }
    return res
      .status(200)
      .json({
        code: 200, success: true,
        message: "Product offer updated successfully",
      });
  }

  async deleteProductOffer(req, res) {
    const offerId = req.params.id;
    const response = await ProductOfferService.deleteProductOffer(offerId);
    if(response.code=== 404){
      return res
      .status(response.code)
      .json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({code: 200, success: true, message: "Product offer deleted successfully" });
  }

  async deleteOffersByProductId(req, res) {
    const productId = req.params.productId;
    const response = await ProductOfferService.deleteOffersByProductId(productId);
    if(response.code=== 404){
      return res
      .status(response.code)
      .json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res
      .status(200)
      .json({code: 200, success: true, message: "All offers for the product deleted successfully" });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductOfferController();

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
    const productOffer = await ProductOfferService.createProductOffer(req.body);
    res
      .status(201)
      .json({
        code: 201,
        success: true,
        message: "Product offer created successfully",
        data: productOffer,
      });
  }

  async getAllProductOffers(req, res) {
    const offers = await ProductOfferService.getAllProductOffers();
    res.status(200).json({code: 200, success: true, data: offers });
  }

  async getProductOfferById(req, res) {
    const offerId = req.params.id;
    const offer = await ProductOfferService.getProductOfferById(offerId);
    res.status(200).json({code: 200, success: true, data: offer });
  }

  async getProductOffersByProductId(req, res) {
    const productId = req.params.productId;
    const offers = await ProductOfferService.getProductOffersByProductId(
      productId
    );
    res.status(200).json({code: 200, success: true, data: offers });
  }

  async getActiveOffers(req, res) {
    const productId = req.params.productId;
    const offers = await ProductOfferService.getActiveOffers(
      productId
    );
    res.status(200).json({code: 200, success: true, data: offers });
  }

  async updateProductOffer(req, res) {
    const updatedOffer = await ProductOfferService.updateProductOffer(
      req.body.offerId,
      req.body
    );
    res
      .status(200)
      .json({
        code: 200, success: true,
        message: "Product offer updated successfully",
        data: updatedOffer,
      });
  }

  async deleteProductOffer(req, res) {
    const offerId = req.params.id;
    await ProductOfferService.deleteProductOffer(offerId);
    res.status(200).json({code: 200, success: true, message: "Product offer deleted successfully" });
  }

  async deleteOffersByProductId(req, res) {
    const productId = req.params.productId;
    await ProductOfferService.deleteOffersByProductId(productId);
    res
      .status(200)
      .json({code: 200, success: true, message: "All offers for the product deleted successfully" });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductOfferController();

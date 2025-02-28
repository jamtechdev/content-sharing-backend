const ProductSEOService = require("../../services/ProductService/ProductSEOService");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");

class ProductSEOController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.createProductSEO.bind(this))
    );
    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getAllProductSEO.bind(this))
    );
    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getSpecificProductSEO.bind(this))
    );
    // this.router.addRoute(
    //   "get",
    //   "/search/title",
    //   authenticate,
    //   authorize(["admin"]),
    //   TryCatch(this.searchSEOByTitle.bind(this))
    // );
    // this.router.addRoute(
    //   "get",
    //   "/search/keywords",
    //   authenticate,
    //   authorize(["admin"]),
    //   TryCatch(this.searchSEOByKeywords.bind(this))
    // );
    this.router.addRoute(
      "put",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.updateSEOById.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.deleteBySEOId.bind(this))
    );
    // this.router.addRoute(
    //   "delete",
    //   "/product/:productId",
    //   authenticate,
    //   authorize(["admin"]),
    //   TryCatch(this.deleteSEOByProductId.bind(this))
    // );
  }

  async createProductSEO(req, res) {
    const data = req.body;
    const response = await ProductSEOService.createProductSEO(data);
    return res.status(201).json({
      code: 201,
      success: true,
      data: response,
    });
  }

  async getAllProductSEO(req, res) {
    const response = await ProductSEOService.getAllSEO();
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async getSpecificProductSEO(req, res) {
    const { id } = req?.params;
    const response = await ProductSEOService.getSEOById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  // async searchSEOByTitle(req, res) {
  //   const { search } = req?.query;
  //   const response = await ProductSEOService.searchSEOByTitle(search);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     data: response,
  //   });
  // }

  // async searchSEOByKeywords(req, res) {
  //   const { search } = req?.query;
  //   const response = await ProductSEOService.searchSEOByKeywords(search);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     data: response,
  //   });
  // }

  async updateSEOById(req, res) {
    const data = req?.body;
    const response = await ProductSEOService.updateSEOById(data);
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async deleteBySEOId(req, res) {
    const { id } = req?.params;
    const response = await ProductSEOService.deleteBySEOId(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product SEO deleted successfully",
    });
  }

  // async deleteSEOByProductId(req, res) {
  //   const { productId } = req?.params;
  //   const response = await ProductSEOService.deleteSEOByProductId(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Product SEO deleted successfully",
  //   });
  // }
  getRouter(){
    return this.router.getRouter()
  }
}

module.exports = new ProductSEOController();

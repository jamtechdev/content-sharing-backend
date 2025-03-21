const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductAttributeService = require('../../services/ProductService/ProductAttributeService')

class ProductAttributeController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-attribute",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.createProductAttribute.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getAllProductAttributes.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getProductAttributeById.bind(this))
    );

    // this.router.addRoute(
    //   "get",
    //   "/product/:productId",
    //   authenticate,
    //   // authorize(["admin"]),
    //   TryCatch(this.getProductAttributesByProductId.bind(this))
    // );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.updateProductAttribute.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.deleteProductAttribute.bind(this))
    );

    // this.router.addRoute(
    //   "delete",
    //   "/product/:productId",
    //   authenticate,
    //   // authorize(["admin"]),
    //   TryCatch(this.deleteAttributesByProductId.bind(this))
    // );
  }

  async createProductAttribute(req, res) {
    const attributeData = req.body;
    const response = await ProductAttributeService.createProductAttribute(attributeData);
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product attribute created successfully",
      data: response,
    });
  }

  async getAllProductAttributes(req, res) {
    const response = await ProductAttributeService.getAllProductAttributes();
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attributes fetched successfully",
      data: response,
    });
  }

  async getProductAttributeById(req, res) {
    const attributeId = req.params.id;
    const response = await ProductAttributeService.getProductAttributeById(attributeId);
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attribute fetched successfully",
      data: response,
    });
  }

  // async getProductAttributesByProductId(req, res) {
  //   const productId = req.params.productId;
  //   const attributes = await ProductAttributeService.getProductAttributesByProductId(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Product attributes fetched successfully",
  //     data: attributes,
  //   });
  // }

  async updateProductAttribute(req, res) {
    const updateData = req.body;
    const response = await ProductAttributeService.updateProductAttribute(updateData.attributeId, updateData);
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attribute updated successfully",
    });
  }

  async deleteProductAttribute(req, res) {
    const attributeId = req.params.id;
    const response = await ProductAttributeService.deleteProductAttribute(attributeId);
    if(response.code === "ERR404"){
      return res.status(404).json({
        code: 404,
        success: true,
        message: response.message,
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attribute deleted successfully",
    });
  }

  // async deleteAttributesByProductId(req, res) {
  //   const productId = req.params.productId;
  //   await ProductAttributeService.deleteAttributesByProductId(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "All product attributes deleted successfully",
  //   });
  // }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductAttributeController();


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
      // authorize(["admin"]),
      TryCatch(this.createProductAttribute.bind(this))
    );

    this.router.addRoute(
      "post",
      "/bulk-create",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.bulkCreateProductAttributes.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.getAllProductAttributes.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.getProductAttributeById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/product/:productId",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.getProductAttributesByProductId.bind(this))
    );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.updateProductAttribute.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.deleteProductAttribute.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/product/:productId",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.deleteAttributesByProductId.bind(this))
    );
  }

  async createProductAttribute(req, res) {
    const attributeData = req.body;
    const newAttribute = await ProductAttributeService.createProductAttribute(attributeData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product attribute created successfully",
      data: newAttribute,
    });
  }

  async bulkCreateProductAttributes(req, res) {
    const attributesData = req.body;
    const newAttributes = await ProductAttributeService.bulkCreateProductAttributes(attributesData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product attributes created successfully",
      data: newAttributes,
    });
  }

  async getAllProductAttributes(req, res) {
    const attributes = await ProductAttributeService.getAllProductAttributes();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attributes fetched successfully",
      data: attributes,
    });
  }

  async getProductAttributeById(req, res) {
    const attributeId = req.params.id;
    const attribute = await ProductAttributeService.getProductAttributeById(attributeId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attribute fetched successfully",
      data: attribute,
    });
  }

  async getProductAttributesByProductId(req, res) {
    const productId = req.params.productId;
    const attributes = await ProductAttributeService.getProductAttributesByProductId(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attributes fetched successfully",
      data: attributes,
    });
  }

  async updateProductAttribute(req, res) {
    const updateData = req.body;
    await ProductAttributeService.updateProductAttribute(updateData.attributeId, updateData);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attribute updated successfully",
    });
  }

  async deleteProductAttribute(req, res) {
    const attributeId = req.params.id;
    await ProductAttributeService.deleteProductAttribute(attributeId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product attribute deleted successfully",
    });
  }

  async deleteAttributesByProductId(req, res) {
    const productId = req.params.productId;
    await ProductAttributeService.deleteAttributesByProductId(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All product attributes deleted successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductAttributeController();


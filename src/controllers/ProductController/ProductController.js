const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductService = require("../../services/ProductService/ProductService");

class ProductController {
  constructor() {
    this.router = new Router();   
    this.router.addRoute(
      "post",
      "/create-product",
      authenticate,
      // authorize(["model"]),
      TryCatch(this.createProduct.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      // authorize(['model']),
      TryCatch(this.getAllPublishedProducts.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      // authorize(['model']),
      TryCatch(this.getProductById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/slug/:slug",
      authenticate,
      // authorize(['admin']),
      TryCatch(this.getProductBySlug.bind(this))
    );

    this.router.addRoute(
      "get",
      "/region/:regionId",
      authenticate,
      // authorize(['admin']),
      TryCatch(this.getProductsByRegionId.bind(this))
    );

    this.router.addRoute(
      "get",
      "/category/:categoryId",
      authenticate,
      // authorize(['admin']),
      TryCatch(this.getProductsByCategoryId.bind(this))
    );

    this.router.addRoute(
      "get",
      "/tag/:tag",
      authenticate,
      // authorize(['admin']),
      TryCatch(this.getProductsByTag.bind(this))
    );

    this.router.addRoute(
      "get",
      "/search",
      authenticate,
      // authorize(['admin']),
      TryCatch(this.searchProductsByName.bind(this))
    );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.updateProduct.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      // authorize(["admin"]),
      TryCatch(this.deleteProduct.bind(this))
    );

  }
  async createProduct(req, res) {
    const productData = req.body;
    const newProduct = await ProductService.createProduct(productData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  }

  async getAllPublishedProducts(req, res) {
    const products = await ProductService.getAllPublishedProducts();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  async getProductById(req, res) {
    const productId = req.params.id;
    const product = await ProductService.getProductById(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  }

  async getProductBySlug(req, res) {
    const slug = req.params.slug;
    const product = await ProductService.getProductBySlug(slug);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  }

  async getProductsByRegionId(req, res) {
    const regionId = req.params.regionId;
    const products = await ProductService.getProductsByRegionId(regionId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  async getProductsByCategoryId(req, res) {
    const categoryId = req.params.categoryId;
    const products = await ProductService.getProductsByCategoryId(categoryId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  async getProductsByTag(req, res) {
    const tag = req.params.tag;
    const products = await ProductService.getProductsByTag(tag);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  async searchProductsByName(req, res) {
    const {search} = req.query;
    const products = await ProductService.searchProductsByName(search);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  async updateProduct(req, res) {
    const updateData = req.body;
    const updatedProduct = await ProductService.updateProduct(
      updateData.productId,
      updateData
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }

  async deleteProduct(req, res) {
    const productId = req.params.id;
    const deletedProduct = await ProductService.deleteProduct(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  }

 getRouter() {
    return this.router.getRouter();
  }
}
module.exports = new ProductController()
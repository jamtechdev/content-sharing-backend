const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductDiscountService = require("../../services/ProductService/ProductDiscountService");

class ProductDiscountController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-discount",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.createProductDiscount.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getAllProductDiscounts.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getProductDiscountById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/product/:productId",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getProductDiscountsByProductId.bind(this))
    );

    // this.router.addRoute(
    //   "get",
    //   "/product/:productId/active",
    //   authenticate,
    //   // authorize(["admin"]),
    //   TryCatch(this.getActiveProductDiscounts.bind(this))
    // );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.updateProductDiscount.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.deleteProductDiscount.bind(this))
    );

    // this.router.addRoute(
    //   "delete",
    //   "/product/:productId",
    //   authenticate,
    //   // authorize(["admin"]),
    //   TryCatch(this.deleteDiscountsByProductId.bind(this))
    // );
  }

  async createProductDiscount(req, res) {
    const discountData = req.body;
    const newDiscount = await ProductDiscountService.createProductDiscount(discountData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product discount created successfully",
      data: newDiscount,
    });
  }

  async getAllProductDiscounts(req, res) {
    const discounts = await ProductDiscountService.getAllProductDiscounts();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product discounts fetched successfully",
      data: discounts,
    });
  }

  async getProductDiscountById(req, res) {
    const discountId = req.params.id;
    const discount = await ProductDiscountService.getProductDiscountById(discountId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product discount fetched successfully",
      data: discount,
    });
  }

  async getProductDiscountsByProductId(req, res) {
    const productId = req.params.productId;
    const discounts = await ProductDiscountService.getProductDiscountsByProductId(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product discounts fetched successfully",
      data: discounts,
    });
  }

  // async getActiveProductDiscounts(req, res) {
  //   const productId = req.params.productId;
  //   const discounts = await ProductDiscountService.getActiveProductDiscounts(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "Active product discounts fetched successfully",
  //     data: discounts,
  //   });
  // }

  async updateProductDiscount(req, res) {
    const updateData = req.body;
    await ProductDiscountService.updateProductDiscount(updateData.discountId, updateData);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product discount updated successfully",
    });
  }

  async deleteProductDiscount(req, res) {
    const discountId = req.params.id;
    await ProductDiscountService.deleteProductDiscount(discountId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product discount deleted successfully",
    });
  }

  // async deleteDiscountsByProductId(req, res) {
  //   const productId = req.params.productId;
  //   await ProductDiscountService.deleteDiscountsByProductId(productId);
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "All product discounts deleted successfully",
  //   });
  // }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductDiscountController();

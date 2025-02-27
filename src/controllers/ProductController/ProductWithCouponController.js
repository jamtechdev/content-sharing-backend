const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductWithCouponService = require("../../services/ProductService/ProductWithCouponService");

class ProductWithCouponController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.createProductWithCoupon.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getAllProductsWithCoupons.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getProductWithCouponById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/coupon/:couponId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getProductsByCouponId.bind(this))
    );

    this.router.addRoute(
      "get",
      "/product/:productId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getCouponsByProductId.bind(this))
    );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.updateProductWithCoupon.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteProductWithCoupon.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/coupon/:couponId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteProductWithCouponByCouponId.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/product/:productId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteProductWithCouponByProductId.bind(this))
    );
  }

  async createProductWithCoupon(req, res) {
    const data = req.body;
    const newEntry = await ProductWithCouponService.createProductWithCoupon(data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product associated with coupon successfully",
      data: newEntry,
    });
  }

  async getAllProductsWithCoupons(req, res) {
    const records = await ProductWithCouponService.getAllProductsWithCoupons();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All products with coupons fetched successfully",
      data: records,
    });
  }

  async getProductWithCouponById(req, res) {
    const id = req.params.id;
    const record = await ProductWithCouponService.getProductWithCouponById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product with coupon fetched successfully",
      data: record,
    });
  }

  async getProductsByCouponId(req, res) {
    const couponId = req.params.couponId;
    const products = await ProductWithCouponService.getProductsByCouponId(couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Products linked to the coupon fetched successfully",
      data: products,
    });
  }

  async getCouponsByProductId(req, res) {
    const productId = req.params.productId;
    const coupons = await ProductWithCouponService.getCouponsByProductId(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Coupons linked to the product fetched successfully",
      data: coupons,
    });
  }

  async updateProductWithCoupon(req, res) {
    const data = req.body
    const response = await ProductWithCouponService.updateProductWithCoupon(data)
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product with coupon updated successfully",
      data: response
    })
  }

  async deleteProductWithCoupon(req, res) {
    const id = req.params.id;
    await ProductWithCouponService.deleteProductWithCoupon(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product with coupon deleted successfully",
    });
  }

  async deleteProductWithCouponByCouponId(req, res) {
    const couponId = req.params.couponId;
    await ProductWithCouponService.deleteByCouponId(couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All products linked to the coupon deleted successfully",
    });
  }

  async deleteProductWithCouponByProductId(req, res) {
    const productId = req.params.productId;
    await ProductWithCouponService.deleteByProductId(productId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All coupons linked to the product deleted successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductWithCouponController();

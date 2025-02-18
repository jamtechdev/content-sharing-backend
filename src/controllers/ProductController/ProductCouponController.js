const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductCouponService = require("../../services/ProductCouponService");

class ProductCouponController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-coupon",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.createProductCoupon.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getAllProductCoupons.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getProductCouponById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/code/:code",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getProductCouponByCode.bind(this))
    );

    this.router.addRoute(
      "get",
      "/active",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getActiveCoupons.bind(this))
    );

    this.router.addRoute(
      "put",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.updateProductCoupon.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteProductCoupon.bind(this))
    );
  }

  async createProductCoupon(req, res) {
    const couponData = req.body;
    const newCoupon = await ProductCouponService.createProductCoupon(couponData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product coupon created successfully",
      data: newCoupon,
    });
  }

  async getAllProductCoupons(req, res) {
    const coupons = await ProductCouponService.getAllProductCoupons();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupons fetched successfully",
      data: coupons,
    });
  }

  async getProductCouponById(req, res) {
    const couponId = req.params.id;
    const coupon = await ProductCouponService.getProductCouponById(couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon fetched successfully",
      data: coupon,
    });
  }

  async getProductCouponByCode(req, res) {
    const code = req.params.code;
    const coupon = await ProductCouponService.getProductCouponByCode(code);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon fetched successfully",
      data: coupon,
    });
  }

  async getActiveCoupons(req, res) {
    const coupons = await ProductCouponService.getActiveCoupons();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Active coupons fetched successfully",
      data: coupons,
    });
  }

  async updateProductCoupon(req, res) {
    const couponId = req.params.id;
    const updateData = req.body;
    const updatedCoupon = await ProductCouponService.updateProductCoupon(couponId, updateData);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon updated successfully",
      data: updatedCoupon,
    });
  }

  async deleteProductCoupon(req, res) {
    const couponId = req.params.id;
    await ProductCouponService.deleteProductCoupon(couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon deleted successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductCouponController();

const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const ProductCouponService = require("../../services/ProductService/ProductCouponService");

class ProductCouponController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-coupon",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.createProductCoupon.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getAllProductCoupons.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getProductCouponById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/code/:code",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getProductCouponByCode.bind(this))
    );

    this.router.addRoute(
      "get",
      "/active/all",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.getActiveCoupons.bind(this))
    );

    this.router.addRoute(
      "put",
      "/",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.updateProductCoupon.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["admin"]),
      TryCatch(this.deleteProductCoupon.bind(this))
    );
  }

  async createProductCoupon(req, res) {
    const couponData = req.body;
    const response = await ProductCouponService.createProductCoupon(couponData);
    if(response.code === 400 || response.code === 409){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Product coupon created successfully",
      data: response,
    });
  }

  async getAllProductCoupons(req, res) {
    const response = await ProductCouponService.getAllProductCoupons();
    if(response.code === 404){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupons fetched successfully",
      data: response,
    });
  }

  async getProductCouponById(req, res) {
    const couponId = req.params.id;
    const response = await ProductCouponService.getProductCouponById(couponId);
    if(response.code === 404){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon fetched successfully",
      data: response,
    });
  }

  async getProductCouponByCode(req, res) {
    const code = req.params.code;
    const response = await ProductCouponService.getProductCouponByCode(code);
    if(response.code === 404){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon fetched successfully",
      data: response,
    });
  }

  async getActiveCoupons(req, res) {
    const response = await ProductCouponService.getActiveCoupons();
    if(response.code === 404){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Active coupons fetched successfully",
      data: response,
    });
  }

  async updateProductCoupon(req, res) {
    const updateData = req.body;
    const response = await ProductCouponService.updateProductCoupon(updateData.couponId, updateData);
    if(response.code === 404){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Product coupon updated successfully",
      data: response,
    });
  }

  async deleteProductCoupon(req, res) {
    const couponId = req.params.id;
    const response = await ProductCouponService.deleteProductCoupon(couponId);
    if(response.code === 404){
      return res.status(response.code).json({
        code: response.code,
        success: false,
        message: response.message
      });
    }
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

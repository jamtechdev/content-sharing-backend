const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const UserCouponService = require("../../services/ProductService/ProductCouponService");

class UserCouponController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.createUserCoupon.bind(this))
    );

    this.router.addRoute(
      "post",
      "/bulk-create",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.bulkCreateUserCoupons.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getUserCouponById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/user/coupon",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getUserCouponsByUserId.bind(this))
    );

    this.router.addRoute(
      "get",
      "/coupon/:couponId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.getUserCouponsByCouponId.bind(this))
    );

    this.router.addRoute(
      "get",
      "/user/:userId/coupon/:couponId",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getUserCoupon.bind(this))
    );

    this.router.addRoute(
      "put",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.updateUserCoupon.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteUserCoupon.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/user/:userId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteUserCouponsByUserId.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/coupon/:couponId",
      authenticate,
    //   authorize(["admin"]),
      TryCatch(this.deleteUserCouponsByCouponId.bind(this))
    );
  }

  async createUserCoupon(req, res) {
    const data = req.body;
    const {userId} = req?.user
    const newEntry = await UserCouponService.createProductCoupon(data, userId);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "User coupon created successfully",
      data: newEntry,
    });
  }

  async bulkCreateUserCoupons(req, res) {
    const data = req.body;
    const newEntries = await UserCouponService.bulkCreateUserCoupons(data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Bulk user coupons created successfully",
      data: newEntries,
    });
  }

  async getUserCouponById(req, res) {
    const id = req.params.id;
    const record = await UserCouponService.getUserCouponById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User coupon fetched successfully",
      data: record,
    });
  }

  async getUserCouponsByUserId(req, res) {
    const {userId} = req?.user
    const records = await UserCouponService.getUserCouponsByUserId(userId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User's coupons fetched successfully",
      data: records,
    });
  }

  async getUserCouponsByCouponId(req, res) {
    const couponId = req.params.couponId;
    const records = await UserCouponService.getUserCouponsByCouponId(couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Users linked to the coupon fetched successfully",
      data: records,
    });
  }

  async getUserCoupon(req, res) {
    const { userId, couponId } = req.params;
    const record = await UserCouponService.getUserCoupon(userId, couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User coupon fetched successfully",
      data: record,
    });
  }

  async updateUserCoupon(req, res) {
    const id = req.params.id;
    const data = req.body;
    const updatedRecord = await UserCouponService.updateUserCoupon(id, data);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User coupon updated successfully",
      data: updatedRecord,
    });
  }

  async deleteUserCoupon(req, res) {
    const id = req.params.id;
    await UserCouponService.deleteUserCoupon(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User coupon deleted successfully",
    });
  }

  async deleteUserCouponsByUserId(req, res) {
    const userId = req.params.userId;
    await UserCouponService.deleteUserCouponsByUserId(userId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All coupons for the user deleted successfully",
    });
  }

  async deleteUserCouponsByCouponId(req, res) {
    const couponId = req.params.couponId;
    await UserCouponService.deleteUserCouponsByCouponId(couponId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All users linked to the coupon deleted successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new UserCouponController();

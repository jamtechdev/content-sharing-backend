const ProductOrderService = require("../../services/ProductService/ProductOrderService");
const Router = require("../../decorators/Router");
const authorize = require("../../middleware/RoleMiddleware");
const authenticate = require("../../middleware/AuthMiddleware");
const TryCatch = require("../../decorators/TryCatch");

class ProductOrderController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
      authorize(["user"]),
      TryCatch(this.createProductOrder.bind(this))
    );
    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getAllOrders.bind(this))
    );
  }

  async createProductOrder(req, res) {
    const { userId } = req?.user;
    const data = req?.body;
    if (!data) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Fields required to create order",
      });
    }
    const response = await ProductOrderService.createOrder(data, userId);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Order created successfully",
      data: response,
    });
  }
  
  async getAllOrders(req, res) {
    const { userId } = req?.user;
    const response = await ProductOrderService.getAllOrders(userId);
    return res
      .status(200)
      .json({
        code: 200,
        success: true,
        message: "Orders fetched successfully",
        data: response,
      });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new ProductOrderController();

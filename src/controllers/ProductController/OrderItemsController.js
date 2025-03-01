const OrderItemsService = require("../../services/ProductService/OrderItemsService");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const Router = require("../../decorators/Router");

class OrderItemsController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
      authorize(["user"]),
      TryCatch(this.createOrderItems.bind(this))
    );
    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getAllOrders.bind(this))
    );
    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getOrderById.bind(this))
    );
    this.router.addRoute(
      "put",
      "/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.updateOrder.bind(this))
    );
    this.router.addRoute(
      "delete",
      "/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.deleteOrder.bind(this))
    );
  }

  async createOrderItems(req, res) {
    const data = req?.body;
    const response = await OrderItemsService.createOrderItems(data);
    return res.status(201).json({
      code: 201,
      success: true,
      data: response,
    });
  }

  async getAllOrders(req, res) {
    const response = await OrderItemsService.getAllOrders();
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async getOrderById(req, res) {
    const { id } = req?.params;
    const response = await OrderItemsService.getOrderById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      data: response,
    });
  }

  async updateOrder(req, res) {
    const data = req?.body;
    await OrderItemsService.updateOrder(data);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Order item updated successfully",
    });
  }

  async deleteOrder(req, res) {
    const { id } = req?.params;
    await OrderItemsService.deleteOrder(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Order item deleted successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}
module.exports = new OrderItemsController()
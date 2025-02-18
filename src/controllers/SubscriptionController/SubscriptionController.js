const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const SubscriptionService = require("../../services/SubscriptionService");
// const db = require('../../models/index')
// const Subscription = db.Subscription

const cron = require("node-cron");

class SubscriptionController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
      authorize(["user"]),
      TryCatch(this.createSubscription.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getAllSubscriptions.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      TryCatch(this.getSubscriptionById.bind(this))
    );

    this.router.addRoute(
      "put",
      "/:id",
      authenticate,
      authorize(["user"]),
      TryCatch(this.updateSubscription.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["user"]),
      TryCatch(this.deleteSubscription.bind(this))
    );
  }

  async createSubscription(req, res) {
    const {userId} = req?.user
    const data = req.body;
    const newSubscription = await SubscriptionService.createSubscription(userId, data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Subscription created successfully",
      data: newSubscription,
    });
  }

  async getAllSubscriptions(req, res) {
    const subscriptions = await SubscriptionService.getAllSubscriptions();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "All subscriptions fetched successfully",
      data: subscriptions,
    });
  }

  async getSubscriptionById(req, res) {
    const id = req.params.id;
    const subscription = await SubscriptionService.getSubscriptionById(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Subscription fetched successfully",
      data: subscription,
    });
  }

  async updateSubscription(req, res) {
    const id = req.params.id;
    const data = req.body;
    const updatedSubscription = await SubscriptionService.updateSubscription(
      id,
      data
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  }

  async deleteSubscription(req, res) {
    const id = req.params.id;
    await SubscriptionService.deleteSubscription(id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Subscription deleted successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new SubscriptionController();

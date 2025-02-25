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
      "/create-subscription",
      authenticate,
      authorize(["user"]),
      TryCatch(this.createSubscription.bind(this))
    );

    this.router.addRoute(
      "get",
      "/get-subscription-by-id/:subscriptionId",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getSubscriptionById.bind(this))
    );

    this.router.addRoute(
      "get",
      "/get-subscriptions/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getAllSubscriptions.bind(this))
    );

    this.router.addRoute(
      "put",
      "/update-subscription/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.updateSubscription.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/delete-subscription/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.deleteSubscription.bind(this))
    );
    this.router.addRoute(
      "get",
      "/session-details",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getUserPayementDetailsSessionDetails.bind(this))
    );
  
  }
  async createSubscription(req, res) {
    // const { userId } = req?.user;
    const data = req?.body;
   

    const { priceId, userData } = data;

    const response = await SubscriptionService.createSubscription(priceId, userData);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Subscription created successfully",
      data: response,
    });
  }

  async getUserPayementDetailsSessionDetails(req, res) {
    const { session_id } = req.query;
    const response = await SubscriptionService.getSessionDetails(session_id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User payement details fetched successfully",
      data: response,
    });
  }
  async getSubscriptionById(req, res) {
    const { subscriptionId } = req?.params;
    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    const response = await SubscriptionService.getSubscriptionById(
      subscriptionId
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User subscription fetched successfully",
      data: response,
    });
  }
  async getAllSubscriptions(req, res) {
    const response = await SubscriptionService.getAllSubscriptions();
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Subscription fetched successfully",
      data: response,
    });
  }
  async updateSubscription(req, res) {
    const data = req?.body;
    if (!data) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Field required to update subscription",
      });
    }
    await SubscriptionService.updateSubscription(data.subscriptionId, data);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Subscription updated successfully",
    });
  }
  async deleteSubscription(req, res) {
    const { subscriptionId } = req?.params;
    await SubscriptionService.deleteSubscription({
      where: { id: subscriptionId },
    });
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Subscription deleted successfully",
    });
  }


  async cronJob(subscriberId, planId) {
    cron.schedule("* * * * *", async () => {
      console.log("cron is running");
      const response =
        await SubscriptionService.cronJobUpdateSubscriptionStatus(4, 1);
      console.log(response);
    });
  }
  getRouter() {
    return this.router.getRouter();
  }
}
module.exports = new SubscriptionController();

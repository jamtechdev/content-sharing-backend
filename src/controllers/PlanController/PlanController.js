const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const TryCatch = require("../../decorators/TryCatch");
const PlanService = require("../../services/PlanService");
const authorize = require("../../middleware/RoleMiddleware");
// const db = require("../../models/index");
// const Plan = db.Plan;

class PlanController {
  constructor() {
    this.router = new Router();
    this.router.addRoute(
      "post",
      "/create-plan",
      authenticate,
      authorize(["model"]),
      TryCatch(this.createPlan.bind(this))
    );

    this.router.addRoute(
      "get",
      "/get-plan-by-id/:planId",
      authenticate,
      authorize(["model"]),
      TryCatch(this.getPlanById.bind(this))
    );
    this.router.addRoute(
      "get",
      "/get-plan",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getAllPlans.bind(this))
    );
    this.router.addRoute(
      "put",
      "/update-plan",
      authenticate,
      authorize(["model"]),
      TryCatch(this.updatePlan.bind(this))
    );
    this.router.addRoute(
      "delete",
      "/delete-plan/:planId",
      authenticate,
      authorize(["model"]),
      TryCatch(this.deletePlan.bind(this))
    );
  }

  async createPlan(req, res) {
    const data = req?.body;
    const { userId } = req?.user;
    const response = await PlanService.createPlan(userId, data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "plan created successfully",
      data: response,
    });
  }

  async getPlanById(req, res) {
    const { planId } = req?.params;
    const response = await PlanService.getPlanById(planId);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Plan fetched successfully",
      data: response,
    });
  }

  async getAllPlans(req, res) {
    const response = await PlanService.getAllPlans();
    if (response.length === 0) {
      return res
        .status(404)
        .json({ code: 404, success: false, message: "Plan not found" });
    }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Plan fetched successfully",
      data: response,
    });
  }

  async updatePlan(req, res) {
    const data = req?.body;
    if (!data) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Field required to update plan",
      });
    }
    await PlanService.updatePlan(data.planId, data);
    return res
      .status(200)
      .json({ code: 200, success: true, message: "Plan updated successfully" });
  }

  async deletePlan(req, res) {
    const { planId } = req?.params;
    await PlanService.deletePlan(planId);
    return res
      .status(200)
      .json({ code: 200, success: true, message: "Plan deleted successfully" });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new PlanController();

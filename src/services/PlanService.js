const PlanRepository = require("../repositories/PlanRepository");
const HttpError = require("../decorators/HttpError");

class PlanService {
  async createPlan(id, data) {
    return await PlanRepository.create(id, data);
  }

  async getPlanByModel(id) {
    const plan = await PlanRepository.getByModel(id);
    if (!plan) {
      throw new HttpError(404, "Plans not found");
    }
    return plan;
  }

  async getAllPlans() {
    const plan = await PlanRepository.getAll();
    if (plan.length === 0) {
      throw new HttpError(404, "Plans not found");
    }
    return plan;
  }

  async getSpecificPlan(id, userId) {
    const plan = await PlanRepository.getPlanByIdAndModelId(id, userId);
    if (!plan) {
      throw new HttpError(404, "Plan not found");
    }
    return plan;
  }

  async updatePlan(id, modelId, data) {
    const plan = await PlanRepository.getPlanByIdAndModelId(id, modelId);
    if (!plan) {
      throw new HttpError(404, "Plan not found");
    }
    return await PlanRepository.update(id, modelId, data);
  }

  async deletePlan(id, modelId) {
    const plan = await PlanRepository.getPlanByIdAndModelId(id, modelId);
    if (!plan) {
      throw new HttpError(404, "Plan not found or already deleted");
    }
    return await PlanRepository.delete(id, modelId);
  }
}

module.exports = new PlanService();

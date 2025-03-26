const PlanRepository = require("../repositories/PlanRepository");
const HttpError = require("../decorators/HttpError");

class PlanService {
  async createPlan(id, data) {
    return await PlanRepository.create(id, data);
  }

  async getPlanById(id) {
    const plan = await PlanRepository.getById(id);
    return plan; 
  }

  async getAllPlans() {
    const plan =  await PlanRepository.getAll();
    return plan
  }

  async updatePlan(id, data) {
    const plan = await PlanRepository.getById(id);
    if (!plan) {
      throw new HttpError(404, "Plan not found");
    }
    return await PlanRepository.update(id, data);
  }

  async deletePlan(id) {
    const plan = await PlanRepository.getById(id);
    if (!plan) {
      throw new HttpError(404, "Plan not found or already deleted");
    }
    return await PlanRepository.delete(id);
  }
}

module.exports = new PlanService();

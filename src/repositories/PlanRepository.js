const db = require("../models/index");

const Plan = db.Plan;

class PlanRepository {
  async create(id, data) {
    data.features = JSON.stringify(data.features)
    return await Plan.create({model_id: id, ...data});
  }

  async getById(id) {
    const plan = await Plan.findOne({ where: { id } });
    plan.features = JSON.parse(plan.features)
    return plan;
  }

  async getByPlanIdAndModelId(planId, modelId) {
    const plan = await Plan.findOne({ where: { id: planId, model_id: modelId } });
    plan.features = JSON.parse(plan.features)
    return plan;
  }

  async getAll() {
    const plans = await Plan.findAll({});
    for(let item of plans){
      item.features = JSON.parse(item.features);
    }
    return plans
  }

  async update(id, data) {
    if(data.features){
      data.features = JSON.stringify(data.features)
    }
    return await Plan.update(data, { where: { id } });
  }

  async delete(id) {
    return await Plan.destroy({ where: { id } });
  }
}

module.exports = new PlanRepository();

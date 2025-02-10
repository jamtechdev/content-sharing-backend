const db = require("../models/index");

const Plan = db.Plan;

class PlanRepository {
  async create(id, data) {
    return await Plan.create({model_id: id, ...data});
  }

  async getById(id) {
    return await Plan.findOne({ where: { id } });
  }

  async getByPlanIdAndModelId(planId, modelId) {
    return await Plan.findOne({ where: { id: planId, model_id: modelId } });
  }

  async getAll() {
    return await Plan.findAll({});
  }

  async update(id, data) {
    return await Plan.update(data, { where: { id } });
  }

  async delete(id) {
    return await Plan.destroy({ where: { id } });
  }
}

module.exports = new PlanRepository();

const db = require("../models/index");

const Plan = db.Plan;

class PlanRepository {
  async create(id, data) {
    return await Plan.create({ model_id: id, ...data });
  }

  async getByModel(id) {
    return await Plan.findAll({ where: { model_id: id } });
  }

  async getPlanByIdAndModelId(planId, userId) {
    return await Plan.findOne({ where: { id: planId, model_id: userId } });
  }

  async getAll() {
    return await Plan.findAll({});
  }
  
  async update(id, modelId, data) {
    return await Plan.update(data, { where: { id, model_id: modelId } });
  }

  async delete(id, modelId) {
    return await Plan.destroy({ where: { id, model_id: modelId } });
  }
}

module.exports = new PlanRepository();
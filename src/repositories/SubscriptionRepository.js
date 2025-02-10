const db = require("../models/index");

const Subscription = db.Subscription;

class SubscriptionRepository {
  async create(userId, data) {
    return await Subscription.create(userId, data);
  }

  async getById(id) {
    return await Subscription.findOne({ where: { id } });
  }

  async getSubscriptionByPlanIdAndModel(subscriberId, modelId, planId){
    return await Subscription.findOne({where: {subscriber_id: subscriberId, plan_id: planId, model_id: modelId}})
  }

  async getAll() {
    return await Subscription.findAll({});
  }

  async update(id, data) {
    return await Subscription.update(data, { where: { plan_id:id } });
  }

  
  async delete(id) {
    return await Subscription.destroy({ where: { id } });
  }
}

module.exports = new SubscriptionRepository();

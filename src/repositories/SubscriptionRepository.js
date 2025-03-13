const db = require("../models/index");

const Subscription = db.Subscription;

class SubscriptionRepository {
  async create(userId, data) {
    return await Subscription.create(userId, data);
  }

  async getById(id) {
    return await Subscription.findOne({ where: { id } });
  }

  async getByUser(id){
    return await Subscription.findOne({subscriber_id: id})
  }
  
  async getBySubscriberIdAndModelId(subscriberId, modelId){
    return await Subscription.findOne({where: {subscriber_id: subscriberId, model_id: modelId}})
  }

  async getAll() {
    return await Subscription.findAll({});
  }

  async update(id, data) {
    return await Subscription.update(data, { where: { id } });
  }

  async delete(id) {
    return await Subscription.destroy({ where: { id } });
  }
}

module.exports = new SubscriptionRepository();

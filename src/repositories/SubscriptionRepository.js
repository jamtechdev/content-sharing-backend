const db = require("../models/index");
const Subscription = db.Subscription;
const ModelProfile = db.ModelProfile;
const Content = db.Content;
const Plan = db.Plan;

class SubscriptionRepository {
  async createSubscription(data) {
    return await Subscription.create(data);
  }

  async getSubscriptionById(id) {
    return await Subscription.findByPk(id);
  }

  async getSubscriptionsByUserId(subscriber_id) {
    return await Subscription.findOne({
      where: { subscriber_id, status: "active" },
      include: [
        {
          model: Plan,
          as: "subscriptionPlan",
          include: [
            {
              model: ModelProfile,
              as: "model",
              attributes: ["id", "user_id"],
              // include: [{
              //   model: Plan,
              //   as: "userPlan"
              // }]
            },
          ],
        },
      ],
    });
  }

  async getSubscriptionsByModelId(model_id) {
    return await Subscription.findAll({ where: { model_id } });
  }

  async getSubscriptionsByPlanId(plan_id) {
    return await Subscription.findAll({ where: { plan_id } });
  }

  async getSpecificSubscription(subscriber_id, model_id, plan_id) {
    return await Subscription.findOne({
      where: { subscriber_id, model_id, plan_id },
    });
  }

  async updateSubscription(id, data) {
    await Subscription.update(data, { where: { id } });
    return await this.getSubscriptionById(id);
  }

  async deleteSubscription(id) {
    return await Subscription.destroy({ where: { id } });
  }

  async deleteSubscriptionsByUserId(subscriber_id) {
    return await Subscription.destroy({ where: { subscriber_id } });
  }

  async deleteSubscriptionsByModelId(model_id) {
    return await Subscription.destroy({ where: { model_id } });
  }
}

module.exports = new SubscriptionRepository();

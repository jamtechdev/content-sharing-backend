const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const PlanRepository = require("../repositories/PlanRepository");
const HttpError = require("../decorators/HttpError");
// const cron = require("node-cron");

class SubscriptionService {
  async createSubscription(userId, data) {
    const { model_id, plan_id } = data;

    const plan = await PlanRepository.getPlanByIdAndModelId(plan_id, model_id);
    if (!plan) {
      throw new HttpError(404, "No such plan exist");
    }
    const endDate = Date.now() + plan.duration * 24 * 60 * 60 * 1000;
    const subscription = await SubscriptionRepository.getSpecificSubscription(
      userId,
      model_id,
      plan_id
    );
    if (subscription) {
      if(subscription.status !== "active"){
        await SubscriptionRepository.updateSubscription(
          subscription.id,
          {
            status: "active",
            start_date: Date.now(),
            end_date: endDate,
          }
        );
      }
      else {
        throw new HttpError(409, "You already have this plan active")
      }
    }
    else {
      const result = {
        subscriber_id: userId,
        model_id: plan.model_id,
        plan_id,
        status: "active",
        start_date: Date.now(),
        end_date: endDate,
      };
      return await SubscriptionRepository.createSubscription(result);
    }
  }

  async getSubscriptionById(id) {
    return await SubscriptionRepository.getSubscriptionById(id);
  }

  async getSubscriptionsByUserId(subscriber_id) {
    return await SubscriptionRepository.getSubscriptionsByUserId(subscriber_id);
  }

  async getSubscriptionsByModelId(model_id) {
    return await SubscriptionRepository.getSubscriptionsByModelId(model_id);
  }

  async getSubscriptionsByPlanId(plan_id) {
    return await SubscriptionRepository.getSubscriptionsByPlanId(plan_id);
  }

  async getSpecificSubscription(subscriber_id, model_id, plan_id) {
    return await SubscriptionRepository.getSpecificSubscription(subscriber_id, model_id, plan_id);
  }

  async updateSubscription(id, data) {
    return await SubscriptionRepository.updateSubscription(id, data);
  }

  async deleteSubscription(id) {
    return await SubscriptionRepository.deleteSubscription(id);
  }

  async deleteSubscriptionsByUserId(subscriber_id) {
    return await SubscriptionRepository.deleteSubscriptionsByUserId(subscriber_id);
  }

  async deleteSubscriptionsByModelId(model_id) {
    return await SubscriptionRepository.deleteSubscriptionsByModelId(model_id);
  }
 
}

module.exports = new SubscriptionService();

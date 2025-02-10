const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const PlanRepository = require('../repositories/PlanRepository')
const HttpError = require("../decorators/HttpError");
const cron = require('node-cron')


class SubscriptionService {
  async createSubscription(userId, data) {
    const {subscriber_id, model_id, plan_id} = data

    const plan = await PlanRepository.getByPlanIdAndModelId(plan_id, model_id)
    if(!plan){
      throw new HttpError(404, "No such plan exist for the given details")
    }
    const subscription_exist = await SubscriptionRepository.getSubscriptionByPlanIdAndModel(userId, model_id, plan_id)

    if(subscription_exist && subscription_exist?.status === "active"){
      throw new HttpError(400, "Subscription is already active")
    }
    
    let endDate = new Date().setDate(plan.duration)
    console.log("Here is your end date===========>", endDate)

    const result = {
      subscriber_id: userId,
      model_id: plan.model_id,
      plan_id,
      status: "active",
      start_date: Date.now(),
      end_date: endDate
    }
    return await SubscriptionRepository.create(result);
  }
  async cronJobUpdateSubscriptionStatus(subscriberId, planId){
    const subscription = await SubscriptionRepository.getBySubscriberAndPlanId(subscriberId, planId)
    console.log("By cron subscription==========>", subscription)
    if(subscription?.status === "active" && subscription.end_date < Date.now()){
      console.log("Inside if")
     return await SubscriptionRepository.update(planId, {status: "expired"})
    }
    return "Your subscription is active"
  }
  // cronJobExpiryCheck();

  async getSubscriptionById(id) {
    const subscription = await SubscriptionRepository.getById(id);
    if (!subscription) {
        throw new HttpError(404, "Subscription not found");
    }
    return subscription; 
  }

  async getAllSubscriptions() {
    const subscription = await SubscriptionRepository.getAll()
    if(subscription.length === 0){
        throw new HttpError(404, "Subscriptions not found")
    }
    return subscription
  }

  async updateSubscription(id, data) {
    const subscription = await SubscriptionRepository.getById(id);
    if (!subscription) {
      throw new HttpError(404, "Subscription not found");
    }
    return await SubscriptionRepository.update(id, data);
  }

  async deleteSubscription(id) {
    const subscription = await SubscriptionRepository.getById(id);
    if (!subscription) {
      throw new HttpError(404, "Subscription not found or already deleted");
    }
    return await SubscriptionRepository.delete(id);
  }
}

module.exports = new SubscriptionService();

const SubscriptionRepository = require('../repositories/SubscriptionRepository')
const PlanRepository = require('../repositories/PlanRepository')

module.exports.checkChatAndVideoCallCount = async (userId) => {
    const subscription = await SubscriptionRepository.getByUser(userId);
    if (!subscription) {
        return {error: "User doesn't have a subscription for this model and plan"};
    }
    
    const plan = await PlanRepository.getById(subscription.plan_id);
    if (!plan) {
        return {error : "No such plan exists"};
    }

    if (subscription.coins <= 0) {
        return {error : "Chat limit is exceeded, please buy a plan to continue your chat"};
    }
    return { success: true }; 
};
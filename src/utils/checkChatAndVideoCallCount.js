const SubscriptionRepository = require('../repositories/SubscriptionRepository')
const PlanRepository = require('../repositories/PlanRepository')

module.exports.checkChatAndVideoCallCount = async (userId) => {
    const subscription = await SubscriptionRepository.getByUser(userId);
    if (!subscription) {
        throw new Error("User doesn't have a subscription for this model and plan");
    }
    
    const plan = await PlanRepository.getById(subscription.plan_id);
    if (!plan) {
        throw new Error("No such plan exists");
    }

    if (plan.chat_count <= 0) {
        throw new Error("Your chat limit is exceeded, please buy a plan to continue your chat");
    }

    await PlanRepository.update(plan.id, { chat_count: plan.chat_count - 1 });

    return plan.chat_count - 1; 
};

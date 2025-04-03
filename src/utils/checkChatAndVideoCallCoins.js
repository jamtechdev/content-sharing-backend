const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const PlanRepository = require("../repositories/PlanRepository");
const ChatSessionRepository = require('../repositories/ChatSessionRepository')

module.exports.checkChatAndVideoCallCoins = async (userId) => {
  const subscription = await SubscriptionRepository.getByUser(userId);
  if (!subscription) {
    return {
      error: "User doesn't have a subscription for this model and plan",
    };
  }
  const plan = await PlanRepository.getById(subscription.plan_id);
  if (!plan) {
    return { error: "No such plan exists" };
  }

  if (subscription.coins <= 0) {
    return {
      error: "Chat limit is exceeded, Insufficient coins!",
    };
  }
  return { success: true };
};

module.exports.updateChatCoins = async (userId) => {
  const session = await ChatSessionRepository.getByUser(userId)
  if(session?.status === "ended"){
    console.log(`Session for the ${userId} is not active i.e ${session.status}`)
    return;
  }
  if(session?.status === "active"){
    const subscription = await SubscriptionRepository.getByUser(userId);
    if (subscription && subscription.plan_type === "basic") {
      return await SubscriptionRepository.update(subscription.id, {
        // coins: subscription.coins === 0 ? 0 : subscription.coins - 1,
        coins: subscription.coins > 0? subscription.coins - 1: 0,
      });
    }
  }
};

const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const PlanRepository = require("../repositories/PlanRepository");
const PlanCountExtensionRepository = require('../repositories/PlanCountExtensionRepository')
const HttpError = require("../decorators/HttpError");
const cron = require("node-cron");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



class SubscriptionService {
  async createSubscription(priceId, data) {
    // const { subscriber_id, model_id, plan_id } = data;
    if (!priceId || !data?.email) {
      throw new HttpError(400, "Missing required parameters");
    }
    const getPlanById = await PlanRepository.getById(priceId);
    // console.log("Here is your data===========>", getPlanById);
    const priceInDollars = parseFloat(getPlanById?.price); // Convert string to number
    const unitAmount = Math.round(priceInDollars * 100);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: getPlanById?.name,
              description: "Detailed astrological compatibility analysis",
            },
            unit_amount: unitAmount, // $4.99
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/my/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      customer_email: data.email,
      metadata: {
        subscriber_id: data?.id,
        plan_id: priceId,
        model_id: 5,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });
    // return await SubscriptionRepository.create(result);
    const result = {
      sessionId: session.id,
      publicKey: process.env.STRIPE_PUBLIC_KEY,
    };

    return result;
  }

  async createPlanExtSubscription(planId, data){
    if (!planId || !data) {
      throw new HttpError(400, "Missing required parameters");
    }
    const subscription = await SubscriptionRepository.getByUser(data.id)
      if(!subscription){
        throw new HttpError(404, "You don't have any valid subscription plan");
      }
    const extensionPlan = await PlanCountExtensionRepository.getById(planId);
    if (!extensionPlan) {
      throw new HttpError(404, "No such extension plan exist");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: extensionPlan?.name,
            },
            unit_amount: extensionPlan.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/my/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      customer_email: data.email,
      metadata: {
        subscriber_id: extensionPlan?.subscriber_id,
        planId,
        model_id: extensionPlan?.model_id
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });
    const result = {
        sessionId: session.id,
        publicKey: process.env.STRIPE_PUBLIC_KEY
    }
    // const subscription = await SubscriptionRepository.getByUser(data.id)
    const updatedData = {
      chat_count: subscription.chat_count + extensionPlan.chat_count,
      video_call_count: subscription.video_call_count + extensionPlan.video_call_count
    }
    await SubscriptionRepository.update(subscription.id, updatedData)
    return result;
  }



  
  async cronJobUpdateSubscriptionStatus(subscriberId, planId) {
    const subscription = await SubscriptionRepository.getBySubscriberAndPlanId(
      subscriberId,
      planId
    );
    console.log("By cron subscription==========>", subscription);
    if (
      subscription?.status === "active" &&
      subscription.end_date < Date.now()
    ) {
      console.log("Inside if");
      return await SubscriptionRepository.update(planId, { status: "expired" });
    }
    return "Your subscription is active";
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
    const subscription = await SubscriptionRepository.getAll();
    if (subscription.length === 0) {
      throw new HttpError(404, "Subscriptions not found");
    }
    return subscription;
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

  async getSessionDetails(session_id) {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const subscription = session.subscription
      ? await stripe.subscriptions.retrieve(session.subscription)
      : null;
    return {
      session: session,
      subscription: subscription,
    };
    // return {
    //   session_id: session.id,
    //   customer_email: session.customer_details?.email,
    //   customer_name: session.customer_details?.name,
    //   amount_total: session.amount_total,
    //   currency: session.currency,

    //   // plan_name: subscription?.items.data[0]?.plan.nickname || "Premium Plan",
    //   subscription_id: subscription?.id,
    //   status: session.payment_status,
    // };
  }
}

module.exports = new SubscriptionService();

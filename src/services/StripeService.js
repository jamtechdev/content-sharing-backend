const Stripe = require("stripe");
const StripeRepository = require("../repositories/StripeRepository");
const Logger = require("../utils/Logger");
const logger = require("../utils/Logger");
const { Json } = require("sequelize/lib/utils");
const SubscriptionService = require("./SubscriptionService");
const PlanRepository = require("../repositories/PlanRepository");
const getSubscriptionDates = require("../utils/subscriptionDates");
const pushNotification = require("../_helper/pushNotification");
const SubscriptionRepository = require("../repositories/SubscriptionRepository");
const ContentService = require("./ContentService");

class StripeService {
  constructor() {
    this.stripe = new Stripe("sk_test_w3ztHLSgWRn6uMRC5JUdjD7E");
  }

  async processWebhookEvent(rawBody, signature) {
    try {
      const webhookSecret = "whsec_Es0NyJNw8CtQWp1WwO3CXjqBgcmQ2oBX";
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      // await StripeRepository.saveSession(session);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("✅ Webhook verified:");
        logger.info("✅ Webhook verified:", JSON.stringify(session));

        if(session.metadata.plan_id){

          console.log("If condition for Subscription purchase ============>")
          const PlanDetails = await PlanRepository.getById(
            Number(session.metadata.plan_id)
          );
  
          const subscriberId = session?.metadata?.subscriber_id
          const subscriptionDetails = subscriberId 
          ? await SubscriptionRepository.getBySubscriberIdAndModelId(subscriberId, PlanDetails.model_id)
          : null;
          const coins = (subscriptionDetails?.coins || 0) + (PlanDetails?.coins || 0);
          const expiresDate = getSubscriptionDates(
            session.created,
            PlanDetails?.duration
          );
          console.log("expiresDate", expiresDate);
          const saveSessionData = {
            stripe_session_id: session.id,
            subscriber_id: session.metadata.subscriber_id || null,
            model_id: 5,
            plan_id: session.metadata.plan_id || null,
            plan_type: PlanDetails?.name,
            status: session?.status === "complete" ? "active" : session?.status,
            payment_mode: null,
            start_date: expiresDate.start_date,
            end_date: expiresDate.end_date,
            stripe_raw_data: session,
            coins
          };
          await pushNotification({
            subscriber_id: session.customer_details?.name,
            Plan_name: PlanDetails?.name,
          });
          if(subscriptionDetails){
            const result = await StripeRepository.updateSession(subscriptionDetails.subscriber_id, saveSessionData);
          }
          else {
            await StripeRepository.saveSession(saveSessionData);
          }
        }
        else {
          console.log("Else condition for Premium Content purchase ============>")
             const saveSessionData = {
            stripe_session_id: session.id,
            buyer_id: session.metadata.buyer_id,
            model_id: 5,
            content_id: session.metadata.content_id,
            price: session.amount_total,
            // status: session?.status === "complete" ? "active" : session?.status,
            payment_mode: "card",
            stripe_raw_data: session,
          };

        await pushNotification({
          buyer_id: session.customer_details?.name
        });
        
          await StripeRepository.saveSessionForPremiumContentAccess(saveSessionData);

      }
      }
      return event;
    } catch (error) {
      
      Logger.error(
        `❌ Webhook signature verification failed: ${error.message}`
      );
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }

  // async processWebhookEventForPremiumContentAccess(rawBody, signature) {
  //   try {
  //     const event = this.stripe.webhooks.constructEvent(
  //       rawBody,
  //       signature,
  //       webhookSecret
  //     );
  //     // await StripeRepository.saveSession(session);
  //     if (event.type === "checkout.session.completed") {
  //       const session = event.data.object;
  //       console.log("✅ Webhook verified:");
  //       logger.info("✅ Webhook verified:", JSON.stringify(session));

  //       const content = await ContentService.getContentById(session.metadata.content_id)
        

  //       const saveSessionData = {
  //         stripe_session_id: session.id,
  //         subscriber_id: session.metadata.subscriber_id || null,
  //         model_id: 5,
  //         content_id: session.metadata.content_id || null,
  //         status: session?.status === "complete" ? "active" : session?.status,
  //         payment_mode: null,
  //         stripe_raw_data: session,
  //       };
  //       await pushNotification({
  //         buyer_id: session.customer_details?.name
  //       });
  //       // if(subscriptionDetails){
  //       //   const result = await StripeRepository.updateSession(subscriptionDetails.subscriber_id, saveSessionData);
  //       // }
  //       // else {
  //         await StripeRepository.saveSessionForPremiumContentAccess(saveSessionData);
  //       // }
  //     }
  //     return event;
  //   } catch (error) {
      
  //     Logger.error(
  //       `❌ Webhook signature verification failed: ${error.message}`
  //     );
  //     throw new Error(`Webhook Error: ${error.message}`);
  //   }
  // }
}

module.exports = new StripeService();

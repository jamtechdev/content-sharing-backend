const Stripe = require("stripe");
const StripeRepository = require("../repositories/StripeRepository");
const Logger = require("../utils/Logger");
const logger = require("../utils/Logger");
const { Json } = require("sequelize/lib/utils");
const SubscriptionService = require("./SubscriptionService");
const PlanRepository = require("../repositories/PlanRepository");
const getSubscriptionDates = require("../utils/subscriptionDates");

class StripeService {
  constructor() {
    this.stripe = new Stripe("sk_test_w3ztHLSgWRn6uMRC5JUdjD7E");
  }

  async processWebhookEvent(rawBody, signature) {
    try {
      const webhookSecret =
        "whsec_9b95ef1a71ad110f9b464b4f756bf867691d00c215c1dd02e1635b7c51901a03";
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      // await StripeRepository.saveSession(session);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        logger.info("✅ Webhook verified:", JSON.stringify(session));

        const PlanDetails = await PlanRepository.getById(
          Number(session.metadata.plan_id)
        );
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
        };
        await StripeRepository.saveSession(saveSessionData);
      }
      return event;
    } catch (error) {
      console.log(
        "========================>Webhook signature verification failed",
        error
      );
      Logger.error(
        `❌ Webhook signature verification failed: ${error.message}`
      );
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }
}

module.exports = new StripeService();

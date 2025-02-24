const Stripe = require("stripe");
const StripeRepository = require("../repositories/StripeRepository");
const Logger = require("../utils/Logger");

class StripeService {
  constructor() {
    this.stripe = new Stripe("sk_test_w3ztHLSgWRn6uMRC5JUdjD7E");
  }

  async processWebhookEvent(rawBody, signature) {
    try {
      const webhookSecret = "whsec_9b95ef1a71ad110f9b464b4f756bf867691d00c215c1dd02e1635b7c51901a03";

      // ✅ Ensure Stripe receives raw body (Buffer) instead of JSON
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      console.log("========================>webhook event", event);

      Logger.info(`✅ Webhook received: ${event.type}`);

      // Save event to DB
    //   await StripeRepository.saveEvent(event.id, event.type, event.data);

      return event;
    } catch (error) {
        console.log("========================>Webhook signature verification failed", error);
      Logger.error(
        `❌ Webhook signature verification failed: ${error.message}`
      );
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }
}

module.exports = new StripeService();

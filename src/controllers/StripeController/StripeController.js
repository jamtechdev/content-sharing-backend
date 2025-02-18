const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Stripe = require("stripe");
const TryCatch = require("../../decorators/TryCatch.js");
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY); // Use secret key on the backend

class StripeController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create-payment-intent",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.handler.bind(this))
    );
  }
  async handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { amount, currency } = req.body; // Get amount and currency from request

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new StripeController();

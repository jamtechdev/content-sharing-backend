const express = require("express");
const StripeService = require("../../services/StripeService.js");

class StripeController {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post(
      "/webhook",
      express.raw({ type: "application/json" }),
      this.handleWebhook.bind(this)
    );
  }

  async handleWebhook(req, res) {
    const signature = req.headers["stripe-signature"];
    console.log("Checking webhook endpoiont =============================>", req.body, signature)

    try {
      const event = await StripeService.processWebhookEvent(
        req.body,
        signature
      );
      res.status(200).json({ received: true, eventType: event.type });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new StripeController();

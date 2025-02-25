const db = require("../models"); // Sequelize models
const Logger = require("../utils/Logger");
const StripeSession = db.Subscription;

class StripeRepository {
  async saveSession(sessionData) {
    console.log("sessionData============]]]]]]]]]]]]]]]]]", sessionData);
    try {
      return await StripeSession.create(sessionData);
    } catch (error) {
      Logger.error(`❌ Error saving session: ${error.message}`);
      throw error;
    }
  }

  async getSessionById(sessionId) {
    try {
      return await StripeSession.findOne({
        where: { session_id: sessionId },
      });
    } catch (error) {
      Logger.error(`❌ Error fetching session: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new StripeRepository();

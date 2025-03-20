const db = require("../models"); // Sequelize models
const Logger = require("../utils/Logger");
const StripeSession = db.Subscription;
const PremiumContentAccessSession = db.premium_content_access;

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

 async updateSession(subscriberId, data){
    try {
      return await StripeSession.update(data, {
        where: {subscriber_id: subscriberId}
      })
    } catch (error) {
      Logger.error(`❌ Error updating session: ${error.message}`);
      throw error;
    }
  }

  async saveSessionForPremiumContentAccess(sessionData){
    try {
      return await PremiumContentAccessSession.create(sessionData)
    } catch (error) {
      Logger.error(`❌ Error saving session: ${error.message}`);
      throw error;
    }
  }

  async getSessionByIdForPremiumContentAccess(sessionId){
    try {
      return await PremiumContentAccessSession.findOne({
        where: {session_id: sessionId}
      });
    } catch (error) {
      Logger.error(`❌ Error fetching session: ${error.message}`);
      throw error;
    }
  }

}

module.exports = new StripeRepository();

const db = require("../models/index.js");

const Tokens = db.DeviceToken;

class NotificationRepository {
  async addToken(data) {
    return await Tokens.create(data);
  }

  async getTokenByUser(data) {
    console.log(Tokens, "modal")
    return await Tokens.findOne({ where: data });
  }

  async updateToken(data) {
    return await Tokens.update(
      data,
      { where: { user_id: data?.user_id } }
    );
  }
}

module.exports = new NotificationRepository();

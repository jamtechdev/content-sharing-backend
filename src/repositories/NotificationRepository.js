const db = require("../models/index.js");

const Tokens = db.DeviceToken;
const Notification = db.Notification;

class NotificationRepository {
  async addToken(data) {
    const t = await db.sequelize.transaction();
    const res = await Tokens.create(data, { transaction: t });
    await t.commit();
    return res;
  }

  async getTokenByUser(data) {
    console.log(Tokens, "modal");
    return await Tokens.findOne({ where: data });
  }

  async updateToken(data) {
    return await Tokens.update(data, { where: { user_id: data?.user_id } });
  }

  async getOnlineUsers() {
    return await Tokens.findAll({
      where: { is_loggedin: 1 },
      attributes: ["token", "user_id"],
      raw: true, // Returns plain objects instead of model instances
    });
  }

  async addNotification(data) {
    return await Notification.bulkCreate(data);
  }
}

module.exports = new NotificationRepository();

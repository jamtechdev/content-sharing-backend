const db = require("../models/index.js");

const Tokens = db.DeviceToken;
const Notification = db.Notification

class NotificationRepository {
  async addToken(data) {
    const t = await db.sequelize.transaction();
    const res =  await Tokens.create(data, { transaction: t });
    await t.commit(); 
    return res
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

  async addNotification(data){
    return await Notification.create(data)
  }
}

module.exports = new NotificationRepository();

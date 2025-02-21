const db = require("../models/index");

const Message = db.Message;

class MessageRepository {
  async createChat(data) {
    return await Message.create(data);
  }

  // async getByUser(userId) {
  //   return await Message.findAll({
  //     where: {
  //       [db.Sequelize.Op.or]: {
  //         senderId: userId,
  //         receiverId: userId,
  //       },
  //     },
  //     order: [["createdAt", "ASC"]],
  //   });
  // }

  async getById(id) {
    return await Message.findOne({ where: { id } });
  }

  async getChat(senderId, receiverId) {
    const data = await Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId, receiverId },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
    });
    return data;
  }

  async deleteChat(senderId, receiverId) {
    return await Message.destroy({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
  }

  async deleteById(messageId) {
    console.log(messageId);
    return await Message.destroy({
      where: { id: messageId },
    });
  }
}

module.exports = new MessageRepository();

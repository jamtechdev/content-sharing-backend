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

  async addMedia(to, from, data) {
    const { secureUrl, resourceType, size } = data;
    return await Message.create({
      senderId: from,
      receiverId: to,
      mediaUrl: secureUrl,
      mediaType: resourceType,
      mediaSize: size,
    });
  }

  async getById(id) {
    return await Message.findOne({ where: { id } });
  }

  async getChat(senderId, receiverId, page, limit) {
    const parsedLimit = parseInt(limit) || 4
    const parsedPage = parseInt(page) || 4
    const offset = (parsedPage-1)*parsedLimit

    const { count, rows } = await Message.findAndCountAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId, receiverId },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      limit: parsedLimit,
      offset
    });
    const totalPages = Math.ceil(count/parsedLimit)
    const data = {
      rows,
      pagination: {
        totalDocs: count,
        totalPages,
        currentPage: parsedPage
      }
    }
    return data;
  }

  async deleteChat(senderId, receiverId) {
    return await Message.destroy({
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
  }

  async deleteById(messageId) {
    console.log(messageId);
    return await Message.destroy({
      where: { id: messageId },
    });
  }
}

module.exports = new MessageRepository();

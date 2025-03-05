const MessageRepository = require("../repositories/MessageRepository");
const HttpError = require("../decorators/HttpError");

class MessageService {
  //   async getChatByUser(userId) {
  //     return await MessageRepository.getByUser(userId);
  //   }

  async addMedia(to, from, data) {
    return await MessageRepository.addMedia(to, from, data);
  }

  async getChat(senderId, receiverId, userId, page, limit) {
    const userChat = await MessageRepository.getChat(
      senderId,
      receiverId,
      userId,
      page,
      limit
    );
    if (userChat.length === 0) {
      throw new HttpError(404, "Chat messages not found");
    }
    return userChat;
  }

  async deleteChat(senderId, receiverId, deletedBy) {
    const userChat = await MessageRepository.getChat(
      senderId,
      receiverId,
      deletedBy
    );
    if (userChat.rows.length === 0) {
      throw new HttpError(404, "Chat messages not found");
    }
    return await MessageRepository.deleteChat(senderId, receiverId, deletedBy);
  }

  async deleteMessage(id) {
    const messageExist = await MessageRepository.getById(id);
    if (!messageExist) {
      throw new HttpError(404, "Message not found");
    }
    return await MessageRepository.deleteById(id);
  }
}
module.exports = new MessageService();

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
      return {code: 404, message: "Chat messages not found"};
    }
    return userChat;
  }

  async deleteMessage(timestamps){
    return await MessageRepository.deleteMessage(timestamps)
  }

  // async deleteChat(senderId, receiverId, deletedBy) {
  //   const userChat = await MessageRepository.getChat(  // need to update as repository
  //     senderId,
  //     receiverId,
  //     deletedBy
  //   );
  //   if (userChat.rows.length === 0) {
  //     return {code: 404, message: "Chat messages not found"};
  //   }
  //   return await MessageRepository.deleteChat(senderId, receiverId, deletedBy);
  // }

  // async deleteMessage(id) {
  //   const messageExist = await MessageRepository.getById(id);
  //   if (!messageExist) {
  //     return {code: 404, message: "Message not found"};
  //   }
  //   return await MessageRepository.deleteById(id);
  // }

  async updateMessages(data){
    const {senderId, receiverId, timestamps, message} = data
    if(!senderId || !receiverId || !timestamps || !message){
      return {code: 400, message: "Missing required parameters"}
    }
    const messageExist = await MessageRepository.getSpecificMessage(data)
    if(!messageExist){
      return {code: 404, message: "Message already deleted"}
    }
    return await MessageRepository.update(data)
  }
}
module.exports = new MessageService();

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
    return {
      senderId: from,
      receiverId: to,
      mediaUrl: secureUrl,
      mediaType: resourceType,
      mediaSize: size,
    };
  }

  async getById(id) {
    return await Message.findOne({ where: { id } });
  }

  // async getChat(senderId, receiverId, userId, page, limit,) {
  //   console.log(senderId, receiverId, userId, page, limit)
  //   const parsedLimit = parseInt(limit) || 10
  //   const parsedPage = parseInt(page) || 1
  //   const offset = (parsedPage-1)*parsedLimit

  //   const { count, rows } = await Message.findAndCountAll({
  //     where: {
  //       [db.Sequelize.Op.or]: [
  //         { senderId, receiverId },
  //         {
  //           senderId: receiverId,
  //           receiverId: senderId,
  //         },
  //       ],
  //       deletedBy: {[db.Sequelize.Op.ne]: userId}
  //     },
  //     order: [["createdAt", "ASC"]],
  //     limit: parsedLimit,
  //     offset
  //   });
  //   console.log(count, rows)

  //   const totalPages = Math.ceil(count/parsedLimit)
  //   const data = {
  //     rows,
  //     pagination: {
  //       totalDocs: count,
  //       totalPages,
  //       currentPage: parsedPage
  //     }
  //   }
  //   return data;
  // }

  async getChat(senderId, receiverId, userId, page, limit) {
    const parsedLimit = parseInt(limit) || 10;
    const parsedPage = parseInt(page) || 1;
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows } = await Message.findAndCountAll({
      where: {
        [db.Sequelize.Op.and]: [
          {
            [db.Sequelize.Op.or]: [
              { senderId, receiverId }, 
              { senderId: receiverId, receiverId: senderId }, 
            ],
          },
          {
            [db.Sequelize.Op.or]: [
              { deletedBy: null }, 
              {deletedBy: { [db.Sequelize.Op.ne]: userId }},
            ],
          },
        ],
      },
      order: [["createdAt", "ASC"]],
      limit: parsedLimit,
      offset,
    });

    const totalPages = Math.ceil(count / parsedLimit);
    const data = {
      rows,
      pagination: {
        totalDocs: count,
        totalPages,
        currentPage: parsedPage,
      },
    };
    return data;
  }

  async deleteChat(senderId, receiverId, deletedBy) {
    const messageCondition = {
      [db.Sequelize.Op.or]: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };
  
    const undeletedMessages = await Message.findAll({
      where: {
        ...messageCondition,
        deletedBy: { [db.Sequelize.Op.ne]: deletedBy },
      },
    });
  
    if (undeletedMessages.length > 0) {
       return await Message.destroy({
        where: {
          ...messageCondition,
          deletedBy: { [db.Sequelize.Op.ne]: deletedBy },
        },
      });
    } else {
      return await Message.update(
        { deletedBy },
        {
          where: {
            ...messageCondition,
            deletedBy: null, 
          },
        }
      );
    }
  }


  async deleteById(messageId) {
    return await Message.destroy({
      where: { id: messageId },
    });
  }
}

module.exports = new MessageRepository();

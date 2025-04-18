const MessageService = require("../../services/MessageService");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");
const { upload } = require("../../utils/MulterConfig");
const { cloudinaryImageUpload } = require("../../utils/cloudinaryService");

class MessageController {
  constructor() {
    this.router = new Router();

    // this.router.addRoute(
    //   "post",
    //   "/create",
    //   authenticate,
    //   authorize(["user", "model"]),
    //   TryCatch(this.createChat.bind(this))
    // );

    this.router.addRoute(
      "post",
      "/add/media",
      authenticate,
      authorize(["user", "model"]),
      upload.single("mediaFile"),
      TryCatch(this.addMediaFile.bind(this))
    );

    this.router.addRoute(
      "get",
      "/sender/:senderId/receiver/:receiverId",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getChatBySpecificUser.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.deleteSpecificMessage.bind(this))
    );

    // this.router.addRoute(
    //   "put",
    //   "/delete/chat",
    //   authenticate,
    //   authorize(["user", "model"]),
    //   TryCatch(this.deleteSpecificChat.bind(this))
    // );

    // this.router.addRoute(
    //   "delete",
    //   "/:id",
    //   authenticate,
    //   authorize(["user", "model"]),
    //   TryCatch(this.deleteMessageById.bind(this))
    // );

    this.router.addRoute(
      "put",
      "/edit/message",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.updateMessages.bind(this))
    );
  }

  async addMediaFile(req, res) {
    const { to, from } = req?.body;
    const mediaFile = req?.file;
    const { secureUrl, resourceType } = await cloudinaryImageUpload(
      mediaFile.path
    );
    const data = {
      secureUrl,
      resourceType,
      size: mediaFile.size,
    };
    // if (mediaFile) {
    const response = await MessageService.addMedia(to, from, data);
    // }

    return res.status(201).json({ code: 201, success: true, data: response });
  }

  async getChatBySpecificUser(req, res) {
    const { senderId, receiverId } = req?.params;
    const { page, limit } = req?.query;
    const { userId } = req?.user;
    const response = await MessageService.getChat(
      senderId,
      receiverId,
      userId,
      page,
      limit
    );
    if (response.code === 404) {
     return res.status(response.code).json({ code: response.code, success: false, message: response.message })
    }
    return res.status(200).json({ code: 200, success: true, data: response });
  }

  // async deleteSpecificChat(req, res) {
  //   const { senderId, receiverId } = req?.body;
  //   const deletedBy = req?.user?.userId;
  //   const response = await MessageService.deleteChat(
  //     senderId,
  //     receiverId,
  //     deletedBy
  //   );
  //   if (response.code === 404) {
  //     return res.status(response.code).json({ code: response.code, success: false, message: response.message })
  //    }
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "User's chat deleted successfully",
  //   });
  // }

  // async deleteMessageById(req, res) {
  //   const { id } = req?.params;
  //   const response = await MessageService.deleteMessage(id);
  //   if (response.code === 404) {
  //     return res.status(response.code).json({ code: response.code, success: false, message: response.message })
  //    }
  //   return res.status(200).json({
  //     code: 200,
  //     success: true,
  //     message: "User's chat deleted successfully",
  //   });
  // }


  async deleteSpecificMessage(req, res){
    const {id} = req?.params
    const response = await MessageService.deleteMessage(id)
    return res.status(200).json({code: 200, success: true, message: "Message deleted successfully"})
  }

  async updateMessages(req, res) {
    const data = req.body
    console.log("updated time data", data )
    const response = await MessageService.updateMessages(data);
    if (response.code === 404 || response.code === 400) {
      return res.status(response.code).json({ code: response.code, success: false, message: response.message })
     }
    return res.status(200).json({
      code: 200,
      success: true,
      message: "User's chat updated successfully",
    });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new MessageController();

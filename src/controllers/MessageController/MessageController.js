const MessageService = require("../../services/MessageService");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");

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
      "get",
      "/sender/:senderId/receiver/:receiverId",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getChatBySpecificUser.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/sender/:senderId/receiver/:receiverId",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.deleteSpecificChat.bind(this))
    );

    this.router.addRoute(
      "delete",
      "/:id",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.deleteMessageById.bind(this))
    );
  }
  
  async getChatBySpecificUser(req, res) {
    const { senderId, receiverId } = req?.params;
    const response = await MessageService.getChat(senderId, receiverId);
    return res.status(200).json({ code: 200, success: true, data: response });
  }

  async deleteSpecificChat(req, res) {
    const { senderId, receiverId } = req?.params;
    console.log(senderId, receiverId);
    const response = await MessageService.deleteChat(senderId, receiverId);
    return res
      .status(200)
      .json({
        code: 200,
        success: true,
        message: "User's chat deleted successfully",
      });
  }

  async deleteMessageById(req, res) {
    const { id } = req?.params;
    await MessageService.deleteMessage(id);
    return res
      .status(200)
      .json({
        code: 200,
        success: true,
        message: "User's chat deleted successfully",
      });
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new MessageController();

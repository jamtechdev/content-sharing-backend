const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const NotificationService = require("../../services/NotificationService.js");
const messaging = require("../../firebase.js");

class NotificatioinController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "post",
      "/",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.addToken.bind(this))
    );
    this.router.addRoute(
      "post",
      "/send-notification",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.sendNotification.bind(this))
    );
    this.router.addRoute(
      "get",
      "/user-notifications",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.getNotificationByRecieverId.bind(this))
    )
  }

  async addToken(req, res) {
    const { device_token } = req?.body;
    const { userId } = req?.user;
    const data = {
      token: device_token,
      user_id: userId,
      is_loggedin: true,
    };
    const existingUser = await NotificationService.getTokenByUser({
      user_id: userId,
    });
    if (existingUser) {
      const result = await NotificationService.updateToken(data);
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Device token updated.",
      });
    }

    const response = await NotificationService.addToken(data);
    return res.status(201).json({
      code: 201,
      success: true,
      message: "Device token saved!.",
    });
  }

  async sendNotification(req, res) {
    const { userId } = req?.user;
    const { title, message, type } = req?.body;
    const item_id = req?.body?.item_id || 0;
    const onlineUsers = await NotificationService.getOnlineUsers();

    const filteredUsers = onlineUsers.filter((user) => user.user_id !== 3);
    const devicesToken = filteredUsers.map((user) => user.token);

    if (devicesToken.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No users available for notification.",
      });
    }

    const payload = {
      notification: {
        title: title,
        body: message,
      },
      data: {
        type: type,
        item_id: `${item_id}`,
        sender_id: `${userId}`,
      },

      tokens: devicesToken,
    };

    const response = await messaging.sendEachForMulticast(payload);
    const notificationsToSave = response.responses
      .map((res, index) => {
        if (res.success && userId !== filteredUsers[index].user_id) {
          return {
            title: title,
            message: message,
            sender_id: userId,
            receiver_id: filteredUsers[index].user_id,
            is_read: false,
            type: item_id,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    if (notificationsToSave.length > 0) {
      await NotificationService.addNotification(notificationsToSave);
    }

    return res
      .status(200)
      .json({ success: true, message: "Notifications sent successfully." });
  }

  async getNotificationByRecieverId(req, res) {
    const { userId } = req?.user;
    const data =  await NotificationService.getNotificationByRecieverId(userId);
    res.status(200).json({
      status:true,
      message:"Notification get successfully",
      data
    })
  }

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new NotificatioinController();

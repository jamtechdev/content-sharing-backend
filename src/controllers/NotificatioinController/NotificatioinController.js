const Router = require("../../decorators/Router");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const TryCatch = require("../../decorators/TryCatch.js");
const NotificationService = require("../../services/NotificationService.js");

class NotificatioinController {
  constructor() {
    this.router = new Router();
    // Using TryCatch to wrap async controller functions
    this.router.addRoute(
      "post",
      "/",
      authenticate,
      authorize(["user", "modal"]),
      TryCatch(this.addToken.bind(this))
    );
  }

  async addToken(req, res) {
    const { device_token } = req?.body;
    const { userId } = req?.user;
    const data = {
      token: device_token,
      user_id: userId,
      is_loggedin : true
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

  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new NotificatioinController();

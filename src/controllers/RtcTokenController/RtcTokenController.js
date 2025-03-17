const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const RtcTokenService = require("../../services/RtcTokenService");

class RtcTokenController {
  constructor() {
    this.router = new Router();
    this.router.addRoute(
      "post",
      "/create",
      authenticate,
      authorize(["user", "model"]),
      TryCatch(this.createVideoCall.bind(this))
    );
  }

  async createVideoCall(req, res){
    const callerId = req?.user?.userId;
    const {receiverId} = req?.body;
    if(!receiverId){
        return res.status(400).json({code: 400, status: false, message: "Receiver id is required"})
    }
    const response = await RtcTokenService.createVideoCall({callerId, receiverId})
    return res.status(201).json({code: 201, status: true, data: response})
  }
  getRouter() {
    return this.router.getRouter();
  }
}


module.exports = new RtcTokenController()
const MuseProposalPollingService = require('../../services/MuseProposalPollingService')
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");


class MuseProposalPollingController {
    constructor() {
      this.router = new Router();
  
      this.router.addRoute(
        "post",
        "/create",
        authenticate,
        authorize(["user"]),
        TryCatch(this.createPoll.bind(this))
      );

      this.router.addRoute(
        "get",
        "/",
        authenticate,
        authorize(["user"]),
        TryCatch(this.getAllPoll.bind(this))
      );

      this.router.addRoute(
        "put",
        "/",
        authenticate,
        authorize(["user"]),
        TryCatch(this.updatePoll.bind(this))
      );

    }

    async createPoll(req, res){
        const data = req.body;
        const {userId} = req?.user
        if(!data.proposal_id || !data.vote){
            return res.status(400).json({code: 400, success: false, message: "Missing required parameters"})
          }
          data.user_id = userId;
          const response = await MuseProposalPollingService.createPoll(data)
          if(response.code){
            return res.status(response.code).json({code: response.code, success: false, message: response.message})
        }
        return res.status(201).json({code: 201, success: true, data: response})
    }
    
    async getAllPoll(req, res){
        const response = await MuseProposalPollingService.getAllPoll()
        if(response.length === 0){
            return res.status(404).json({code: 404, success: false, message: "Muse proposal data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async updatePoll(req, res){
        const data = req?.body
        const response = await MuseProposalPollingService.updatePoll(data.id, data)
        return res.status(200).json({code: 200, success: true, data: response})
    }


    getRouter() {
        return this.router.getRouter();
      }
}

module.exports = new MuseProposalPollingController()

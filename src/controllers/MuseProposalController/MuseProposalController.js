const MuseProposalService = require('../../services/MuseProposalService')
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");


class MuseProposalController {
    constructor() {
      this.router = new Router();
  
      this.router.addRoute(
        "post",
        "/create",
        authenticate,
        authorize(["user"]),
        TryCatch(this.createMuseProposal.bind(this))
      );

      this.router.addRoute(
        "get",
        "/",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.getAllMuseProposal.bind(this))
      );

      this.router.addRoute(
        "put",
        "/",
        authenticate,
        authorize(["user"]),
        TryCatch(this.updateMuseProposal.bind(this))
      );

    }


    async createMuseProposal(req, res){
        const data = req.body;
        const subscriberId = req?.user?.userId
        if(!data.proposal){
            return res.status(400).json({code: 400, success: false, message: "Missing required parameters"})
        }
        
        data.subscriber_id = subscriberId
        const response = await MuseProposalService.createProposal(data)
        if(response.code === 409){
          return res.status(response.code).json({code: response.code, success:false, message: response.message})
        }
        return res.status(201).json({code: 201, success: true, data: response})
    }
    
    async getAllMuseProposal(req, res){
        const response = await MuseProposalService.getAllProposal()
        if(response.length === 0){
            return res.status(404).json({code: 404, success: false, message: "Muse proposal data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async updateMuseProposal(req, res){
        const data = req?.body
        const response = await MuseProposalService.updateProposal(data.id, data)
        return res.status(200).json({code: 200, success: true, data: response})
    }


    getRouter() {
        return this.router.getRouter();
      }
}

module.exports = new MuseProposalController()

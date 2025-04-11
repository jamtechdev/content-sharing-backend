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
        "/shoutout/:id",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.shoutOutWinner.bind(this))
      );

      this.router.addRoute(
        "get",
        "/",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.getAllMuseProposal.bind(this))
      );

      this.router.addRoute(
        "get",
        "/shoutout/shortlist",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.mysteryShoutOutShortlist.bind(this))
      );

      this.router.addRoute(
        "put",
        "/",
        authenticate,
        authorize(["model"]),
        TryCatch(this.updateMuseProposal.bind(this))
      );

      this.router.addRoute(
        "delete",
        "/type/:type/:id",
        authenticate,
        authorize(["model"]),
        TryCatch(this.deleteMuseProposal.bind(this))
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
      let response 
      if(req?.user.role === "user"){
        response = await MuseProposalService.getApprovedProposal()
      }
      else {
        response = await MuseProposalService.getAllProposal()
      }
        if(response.length === 0){
            return res.status(404).json({code: 404, success: false, message: "Muse proposal data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async shoutOutWinner(req, res){
      const {id} = req?.params;
      const response = await MuseProposalService.getProposalById(id)
      if(response.code){
        return res.status(response.code).json({code: response.code, success: false, message: response.message})
      }
      return res.status(200).json({code: 200, success: true, data: response})
    }

    async mysteryShoutOutShortlist(req, res){
      const response = await MuseProposalService.getShoutOutShortlist();
      return res.status(200).json({code: 200, success: true, data: response})
    }

    async updateMuseProposal(req, res){
        const data = req?.body
        const response = await MuseProposalService.updateProposal(data.id, data)
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async deleteMuseProposal(req, res){
        const {id, type} = req?.params
        const response = await MuseProposalService.deleteProposal(id, type)
        return res.status(200).json({code: 200, success: true, data: `${type === "proposal"? "Proposal": type === "poll"? "Poll": "Question" } deleted successfully`})
    }

    getRouter() {
        return this.router.getRouter();
      }
}

module.exports = new MuseProposalController()

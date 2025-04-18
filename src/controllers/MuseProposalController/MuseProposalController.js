const MuseProposalService = require('../../services/MuseProposalService')
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");
const MuseProposalReplyService = require('../../services/MuseProposalReplyService')



class MuseProposalController {
    constructor() {
      this.router = new Router();
  
      this.router.addRoute(
        "post",
        "/create",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.createMuseProposal.bind(this))
      );

      this.router.addRoute(
        "get",
        "/winner/:id",
        authenticate,
        authorize(["model"]),
        TryCatch(this.shoutOutWinnerDeclare.bind(this))
      );

      this.router.addRoute(
        "get",
        "/reply/shoutout/:id",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.shoutOutWinnerDeclareForReply.bind(this))
      );

      this.router.addRoute(
        "get",
        "/month/winner",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.getMonthlyShoutOutWinner.bind(this))
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
        "put",
        "/seen/status",
        authenticate,
        authorize(["model", "user"]),
        TryCatch(this.updateWinnerSeenStatus.bind(this))
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
        const role = req?.user?.role
        if(!data.proposal){
            return res.status(400).json({code: 400, success: false, message: "Missing required parameters"})
        }
        
        data.subscriber_id = subscriberId
        const response = await MuseProposalService.createProposal(data, role)
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

    async getMonthlyShoutOutWinner(req, res){
      const response = await MuseProposalService.getShoutOutWinner()
      if(response.code){
        return res.status(response.code).json({code: response.code, success: false, message: response.message})
      }
      return res.status(200).json({code: 200, success: true, data: response})
    }

    async shoutOutWinnerDeclare(req, res){
      const {id} = req?.params;
      // const response = await MuseProposalService.getProposalById(id)
      // if(response.code){
      //   return res.status(response.code).json({code: response.code, success: false, message: response.message})
      // }
      await MuseProposalService.updateProposal(id, {is_winner: true, winner_declared_at: new Date()})
      return res.status(200).json({code: 200, success: true, message: "Poll shoutout declared successfully"})
    }
    
    async shoutOutWinnerDeclareForReply(req, res){ 
      const {id} = req?.params;
      // const response = await MuseProposalService.getShoutOutWinnerForReply(id)
      // if(response.code){
      //   return res.status(response.code).json({code: response.code, success: false, message: response.message})
      // }
      // return res.status(200).json({code: 200, success: true, data: response})
      await MuseProposalReplyService.updateProposalReply(id, {is_winner: true, winner_declared_at: new Date()})
      return res.status(200).json({code: 200, success: true, message: "Reply shoutout declared successfully"})
    }

    async mysteryShoutOutShortlist(req, res){
      const response = await MuseProposalService.getShoutOutShortlist();
      return res.status(200).json({code: 200, success: true, data: response})
    }


    async updateWinnerSeenStatus(req, res){
      const data = req.body
      for(let id of data.winner_id){
        await MuseProposalService.updateProposal(id, data)
      }
      return res.status(200).json({code: 200, success: true, message: "Seen status updated successfully"})
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

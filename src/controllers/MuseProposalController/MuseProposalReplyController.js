const MuseProposalReplyService = require('../../services/MuseProposalReplyService')
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");


class MuseProposalReplyController {
    constructor() {
      this.router = new Router();
      this.router.addRoute(
        "post",
        "/create",
        authenticate,
        authorize(["user"]),
        TryCatch(this.createMuseProposalReply.bind(this))
      );

      this.router.addRoute(
        "get",
        "/",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.getAllMuseProposalReply.bind(this))
      );

      this.router.addRoute(
        "put",
        "/",
        authenticate,
        authorize(["model"]),
        TryCatch(this.updateMuseProposalReply.bind(this))
      );

      // this.router.addRoute(
      //   "delete",
      //   "/:id",
      //   authenticate,
      //   authorize(["model"]),
      //   TryCatch(this.deleteMuseProposalReply.bind(this))
      // );
    }

    async createMuseProposalReply(req, res){
        const data = req?.body
        if(!data.reply){
            return res.status(400).json({code: 400, success: false, message: "Missing required fields"})
        }
        const response = await MuseProposalReplyService.createProposalReply({user_id: req?.user?.userId, ...data})
        return res.status(201).json({code: 201, success:true, data: response})
    }

    async getAllMuseProposalReply(req, res){
        let response;
        if(req?.user?.role === "user"){
            response = await MuseProposalReplyService.getAllApprovedReply()
        }
        else {
            response = await MuseProposalReplyService.getAllProposalReply()
        }
        if(response.length === 0){
            return res.status(404).json({code: 404, success: false, message: "Proposal reply data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async updateMuseProposalReply(req, res){
        const data = req?.body
        const response = await MuseProposalReplyService.updateProposalReply(data.id, data)
        return res.status(200).json({code: 200, success: true, message: "Muse proposal reply updated successfully"})
    }

    // async deleteMuseProposalReply(req, res){
    //     const id = req?.params?.id;
    //     const response = await MuseProposalReplyService.deleteProposalReply(id)
    //     return res.status(200).json({code: 200, success: true, message: "Reply deleted successfully"})
    // }

    getRouter() {
        return this.router.getRouter();
      }
}

module.exports = new MuseProposalReplyController()

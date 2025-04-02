
//  Working on it--------------------
const WildcardRevealService = require('../../services/WildcardRevealService')
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");


class WildcardRevealController {
    constructor() {
      this.router = new Router();
  
      this.router.addRoute(
        "post",
        "/create",
        authenticate,
        authorize(["user"]),
        TryCatch(this.createReveal.bind(this))
      );

      this.router.addRoute(
        "get",
        "/",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.getAllReveals.bind(this))
      );

      this.router.addRoute(
        "put",
        "/",
        authenticate,
        authorize(["user"]),
        TryCatch(this.updateReveal.bind(this))
      );

    }


    async createReveal(req, res){
        const data = req.body;
        const subscriberId = req?.user?.userId
        if(!data.proposal){
            return res.status(400).json({code: 400, success: false, message: "Missing required parameters"})
        }
        
        data.subscriber_id = subscriberId
        const response = await WildcardRevealService.createProposal(data)
        if(response.code === 409){
          return res.status(response.code).json({code: response.code, success:false, message: response.message})
        }
        return res.status(201).json({code: 201, success: true, data: response})
    }
    
    async getAllReveals(req, res){
        const response = await WildcardRevealService.getAllProposal()
        if(response.length === 0){
            return res.status(404).json({code: 404, success: false, message: "Muse proposal data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async updateReveal(req, res){
        const data = req?.body
        const response = await WildcardRevealService.updateProposal(data.id, data)
        return res.status(200).json({code: 200, success: true, data: response})
    }


    getRouter() {
        return this.router.getRouter();
      }
}

module.exports = new WildcardRevealController()

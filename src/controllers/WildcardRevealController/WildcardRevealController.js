const WildcardRevealService = require('../../services/WildcardRevealService')
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");
const {upload} = require('../../utils/MulterConfig');
const {uploadToS3} = require('../../config/S3upload')

class WildcardRevealController {
    constructor() {
      this.router = new Router();
  
      this.router.addRoute(
        "post",
        "/create",
        authenticate,
        authorize(["model"]),
        TryCatch(this.createReveal.bind(this))
      );

      this.router.addRoute(
        "get",
        "/:id",
        authenticate,
        authorize(["user", "model"]),
        TryCatch(this.getRevealById.bind(this))
      );

      this.router.addRoute(
        "get",
        "/get/random",
        authenticate,
        authorize(["user"]),
        TryCatch(this.getRandomRevealContent.bind(this))
      );

      this.router.addRoute(
        "get",
        "/",
        authenticate,
        authorize(["model"]),
        TryCatch(this.getAllReveals.bind(this))
      );

      this.router.addRoute(
        "put",
        "/",
        authenticate,
        authorize(["model"]),
        TryCatch(this.updateReveal.bind(this))
      );

    }

    async createReveal(req, res){
        const data = req.body;
        const response = await WildcardRevealService.createReveal({reveal_content: data.content, reveal_type: data.resourceType, ...data})
        if(response.code === 409){
          return res.status(response.code).json({code: response.code, success:false, message: response.message})
        }
        return res.status(201).json({code: 201, success: true, data: response})
    }
    
    async getRevealById(req, res){
      const {id} = req.params;
        const response = await WildcardRevealService.getRevealById(id)
        if(!response){
            return res.status(404).json({code: 404, success: false, message: "Wildcard reveal data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async getRandomRevealContent(req, res){
        const {userId} = req?.user
        const response = await WildcardRevealService.getByRandomId(userId)
        if(response.code){
            return res.status(response.code).json({code: response.code, success: false, message: response.message})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async getAllReveals(req, res){
        const response = await WildcardRevealService.getAllReveals()
        if(response.length === 0){
            return res.status(404).json({code: 404, success: false, message: "Wildcard reveal data not found"})
        }
        return res.status(200).json({code: 200, success: true, data: response})
    }

    async updateReveal(req, res){
        const data = req?.body
        const response = await WildcardRevealService.updateReveal(data.id, data)
        return res.status(200).json({code: 200, success: true, data: response})
    }


    getRouter() {
        return this.router.getRouter();
      }
}

module.exports = new WildcardRevealController()

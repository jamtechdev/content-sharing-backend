const PlanCountExtensionService = require('../../services/PlanCountExtensionService')
const TryCatch = require('../../decorators/TryCatch')
const authorize = require('../../middleware/RoleMiddleware')
const authenticate = require('../../middleware/AuthMiddleware')
const Router = require('../../decorators/Router')



class PlanExtensionController {
    constructor(){
        this.router = new Router();

        this.router.addRoute(
            "post",
            '/create',
            authenticate,
            authorize(['model']),
            TryCatch(this.createPlanExtension.bind(this))
        )
        this.router.addRoute(
            "get",
            '/',
            authenticate,
            authorize(['model']),
            TryCatch(this.getAllPlanExt.bind(this))
        )
        this.router.addRoute(
            "get",
            '/:id',
            authenticate,
            authorize(['model']),
            TryCatch(this.getPlanExtById.bind(this))
        )
    }

    async createPlanExtension(req, res){
        const data = req?.body
        const {userId} = req?.user
        const response = await PlanCountExtensionService.createPlanExtension(data, userId)
        return res.status(201).json({
            code: 201,
            success: true,
            data: response
        })
    }

    async getAllPlanExt(req, res){
        const response = await PlanCountExtensionService.getAllPlanExt()
        if(response.length ===0){
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Plans extensions not found"
            })
        }
    }
    async getPlanExtById(req, res){
        const {planId} = req?.params
        const response = await PlanCountExtensionService.getPlanExtById(planId)
        if(!response){
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Plans extension not found"
            })
        }
    }

    getRouter(){
        return this.router.getRouter()
    }
}

module.exports = new PlanExtensionController()
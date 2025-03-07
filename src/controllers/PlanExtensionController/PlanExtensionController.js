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
            authorize(['model', 'user']),
            TryCatch(this.getAllPlanExt.bind(this))
        )
        this.router.addRoute(
            "get",
            '/:id',
            authenticate,
            authorize(['model', 'user']),
            TryCatch(this.getPlanExtById.bind(this))
        )

        this.router.addRoute(
            "put",
            '/',
            authenticate,
            authorize(['model']),
            TryCatch(this.updatePlanExtById.bind(this))
        )
        this.router.addRoute(
            "delete",
            '/:id',
            authenticate,
            authorize(['model']),
            TryCatch(this.deletePlanExtById.bind(this))
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
        return res.status(200).json({
            code: 200,
            success: true,
            data: response
        })
    }


    async getPlanExtById(req, res){
        const {id} = req?.params
        const response = await PlanCountExtensionService.getPlanExtById(id)
        if(!response){
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Plans extension not found"
            })
        }
        return res.status(200).json({
            code: 200,
            success: true,
            data: response
        })
    }

    async updatePlanExtById(req, res){
        const data = req.body
        const response = await PlanCountExtensionService.updateById(data)
        if(response.status == 404){
            return res.status(response.status).json({code: 404, success: false, message: response.message})
        }
        return res.status(200).json({code: 200, success: true, message: "Extension plan updated successfully"})
    }

    async deletePlanExtById(req, res){
        const {id} = req?.params
        const response = await PlanCountExtensionService.deleteById(id)
        if(response.status == 404){
            return res.status(response.status).json({code: 404, success: false, message: response.message})
        }
        return res.status(200).json({code: 200, success: true, message: "Extension plan updated successfully"})
    }

    getRouter(){
        return this.router.getRouter()
    }
}

module.exports = new PlanExtensionController()
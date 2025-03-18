const AdditionalSupportService = require("../../services/AdditionalSupportService");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");

class AdditionalSupportController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create",
      authenticate,
      authorize(["user"]),
      TryCatch(this.createSupport.bind(this))
    );

    this.router.addRoute(
      "get",
      "/",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getAllSupport.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getByIdSupport.bind(this))
    );
  }

  async createSupport(req, res){
    const data = req?.body;
    const response = await AdditionalSupportService.createSupport(data)
    return res.status(201).json({code: 201, success:true, data: response})
  }

  async getAllSupport(req, res){
    const response = await AdditionalSupportService.getAllSupport(data)
    if(response.length === 0){
        return res.status(200).json({code: 200, success: true, message: "Data not found"})
    }
    return res.status(201).json({code: 201, success:true, data: response})
  }

  async getByIdSupport(req, res){
    const {id} = req?.params
    const response = await AdditionalSupportService.getByIdSupport(id)
    if(!response){
        return res.status(200).json({code: 200, success: true, message: "Data not found"})
    }
    return res.status(201).json({code: 201, success:true, data: response})
  }
  getRouter() {
    return this.router.getRouter();
  }
}

module.exports = new AdditionalSupportController()

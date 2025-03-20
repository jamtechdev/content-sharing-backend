const Router = require("../../decorators/Router");
const TryCatch = require("../../decorators/TryCatch");
const authenticate = require("../../middleware/AuthMiddleware");
const authorize = require("../../middleware/RoleMiddleware");
const PremiumContentAccessService = require("../../services/PremiumContentAccessService");
const ContentService = require('../../services/ContentService');
const SubscriptionService = require("../../services/SubscriptionService");

class SubscriptionController {
  constructor() {
    this.router = new Router();

    this.router.addRoute(
      "post",
      "/create/premium-access",
      authenticate,
      authorize(["user"]),
      TryCatch(this.createPremiumContentAccess.bind(this))
    );
        
    this.router.addRoute(
        'get',
        '/session/details',
        authenticate,
        authorize(['user']),
        TryCatch(this.getUserPaymentDetailsForPremiumContent.bind(this))
    );

    this.router.addRoute(
      "get",
      "/:id",
      authenticate,
      authorize(["user"]),
      TryCatch(this.getPremiumContentAccess.bind(this))
    );
    }

     async createPremiumContentAccess(req, res) {
       const data = req?.body;
       const { contentId, userData } = data;
       if(!contentId){
        return res.status(400).json({code: 400, success: false, message: "Missing required parameters"})
       }
      
       const response = await PremiumContentAccessService.createPremiumContentAccess(contentId, userData);
       if(response.code === "ERR404"){
        return res.status(404).json({code: 404, success: false, message: response.message})
       }
       if(response.code === "ERR409"){
        return res.status(409).json({code: 409, success: false, message: response.message})
       }
       return res.status(201).json({
         code: 201,
         success: true,
         message: "Premium content purchased successfully",
         data: response,
       });
     }


     async getUserPaymentDetailsForPremiumContent(req, res){
        const {session_id}= req?.query;
        const response = await SubscriptionService.getSessionDetails(session_id);
        return res.status(200).json({
            code: 200,
            success: true,
            message: "User payment details fetched successfully",
            data: response,
          });
     }

     async getPremiumContentAccess(req, res){
        const {id} = req?.params;
        const response = await PremiumContentAccessService.getPremiumContentAccessById(id);
        if(response){
            return res.status(200).json({
                code: 200,
                success: true,
                message: "User don't have premium content access"
            })
        }
        return res.status(200).json({
            code: 200,
            success: true,
            data: response,
        })
     }

     getRouter() {
      return this.router.getRouter();
    }
}   


module.exports = new SubscriptionController()
const PlanCountExtensionRepository = require("../repositories/PlanCountExtensionRepository");
const ProfileRepository = require('../repositories/ProfileRepository')
const HttpError = require("../decorators/HttpError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PlanCountExtensionService {
  async createPlanExtension(data, userId) {
    const modelProfile = await ProfileRepository.findProfileById(userId)
    data.model_id = modelProfile.id
    return await PlanCountExtensionRepository.create(data)
  }

  async getAllPlanExt(){
    return await PlanCountExtensionRepository.getAll()
  }
  async getPlanExtById(id){
    return await PlanCountExtensionRepository.getById(id)
  }

  async updateById(data){
    const extPlanExist = await PlanCountExtensionRepository.getById(data.id)
    if(!extPlanExist){
      return {status: 404, message: "Extension plan not found"}
    }
    return await PlanCountExtensionRepository.update(data.id, data)
  }

  async deleteById(id){
    const extPlanExist = await PlanCountExtensionRepository.getById(id)
    if(!extPlanExist){
      return {status: 404, message: "Extension plan not found"}
    }
    return await PlanCountExtensionRepository.destroy(id)
  }
}


module.exports = new PlanCountExtensionService()
const db = require('../models/index')

const PlanCountExtension= db.plan_count_extension;



class PlanCountExtensionRepository {
    async create(data){
        return await PlanCountExtension.create(data)
    }

    async getById(id){
        return await PlanCountExtension.findOne({
            where: {id}
        })
    }

    async getAll(){
        return await PlanCountExtension.findAll()
    }

}

module.exports = new PlanCountExtensionRepository();
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

    async update(id, data){
       return await PlanCountExtension.update(data, {
        where: {id}
       })
    }
    
    async delete(id){
      return await PlanCountExtension.destroy({where: {id}})
    }

}

module.exports = new PlanCountExtensionRepository();
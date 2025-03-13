const db = require('../models/index')

const AdditionalSupport = db.additional_support;

class AdditionalSupportRepository {
    async create(data){
        return await AdditionalSupport.create(data)
    }

    async getAll(){
        return await AdditionalSupport.findAll()
    }

    async getById(id){
        return await AdditionalSupport.findOne({where: {id}})
    }
}

module.exports = new AdditionalSupportRepository()
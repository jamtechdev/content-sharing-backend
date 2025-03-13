const AdditionalSupportRepository = require('../repositories/AdditionalSupportRepository')

class AdditionalSupportService {
    async createSupport(data){
        return await AdditionalSupportRepository.create(data)
    }

    async getAllSupport(){
        return await AdditionalSupportRepository.getAll()
    }

    async getByIdSupport(id){
        return await AdditionalSupportRepository.getById(id)
    }
}

module.exports = new AdditionalSupportService();
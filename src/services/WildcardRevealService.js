const WildcardRevealRepository = require('../repositories/WildcardRevealRepository')

class WildcardRevealService{
    async createReveal(data){
        return await WildcardRevealRepository.create(data)
    }

    async getRevealById(id){
        return await WildcardRevealRepository.getById(id)
    }

    async getAllReveals(){
        return await WildcardRevealRepository.getAll()
    }

    async updateReveal(id, data){
        return await WildcardRevealRepository.update(id, data)
    }
}

module.exports = new WildcardRevealService()
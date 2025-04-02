const db = require('../models/index')
const WildcardReveal = db.wildcard_reveal;


class WildcardRevealRepository{
    async create(data){
        return await WildcardReveal.create(data)
    }

    async getById(id){
        return await WildcardReveal.findOne({where: {id}})
    }

    async getAll(){
        return await WildcardReveal.findAll({})
    }

    async update(id, data){
        return await WildcardReveal.update(data, {where: {id}})
    }
}

module.exports = new WildcardRevealRepository();
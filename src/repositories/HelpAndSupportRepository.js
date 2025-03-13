const db = require('../models/index')

const HelpAndSupport = db.help_and_support;


class HelpAndSupportRepository {
    async getAll(){
        return await HelpAndSupport.findAll({})
    }

    async getById(id){
        return await HelpAndSupport.findOne({where: {id}})
    }
}

module.exports = new HelpAndSupportRepository()
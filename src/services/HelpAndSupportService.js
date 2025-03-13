const HelpAndSupportRepository = require("../repositories/HelpAndSupportRepository");


class HelpAndSupportService {
    async getAllHelpSupport(){

        let response = await HelpAndSupportRepository.getAll()
        response = response.map(item =>{
            item = item.toJSON()
            item.query = JSON.parse(item.query)
            return item
        })
        return response
    }

    async getByIdHelpSupport(id){
        return await HelpAndSupportRepository.getById(id)
    }
}

module.exports = new HelpAndSupportService()
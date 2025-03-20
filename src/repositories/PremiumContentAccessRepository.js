const db = require('../models/index');

const PremiumContentAccess = db.premium_content_access;

class PremiumContentAccessRepository {
    async getById(id){
        return await PremiumContentAccess.findOne({
            where: {id}
        })
    }
    async getAll(){
        return await PremiumContentAccess.findAll()
    }

    async getByContentAndUser(contentId, userId){
        return await PremiumContentAccess.findOne({where: {
            buyer_id: userId,
            content_id: contentId
        }})
    }
}

module.exports = new PremiumContentAccessRepository();
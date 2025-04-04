const db = require('../models/index')
const MuseProposalPolling = db.muse_proposal_polling;


class MuseProposalPollingRepository{
    async create(data){
        return await MuseProposalPolling.create(data)
    }

    async getByUser(userId, proposalId){
        return await MuseProposalPolling.findOne({where: {
            user_id: userId, 
            proposal_id: proposalId
        }})
    }

    async getById(id){
        return await MuseProposalPolling.findOne({where: {id}})
    }

    async getAll(){
        return await MuseProposalPolling.findAll({})
    }

    async update(id, data){
        return await MuseProposalPolling.update(data, {where: {id}})
    }
}

module.exports = new MuseProposalPollingRepository();
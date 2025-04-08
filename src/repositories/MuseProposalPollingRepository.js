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

    async delete(id) {
        return await MuseProposalPolling.destroy({ where: { id } })
    }

    async deleteByProposalId(id) {
        return await MuseProposalPolling.destroy({ where: { proposal_id: id } })
    }
}

module.exports = new MuseProposalPollingRepository();
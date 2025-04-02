const db = require('../models/index')
const MuseProposal = db.muse_proposal;
const MuseProposalPolling = db.muse_proposal_polling


class MuseProposalRepository{
    async create(data){
        return await MuseProposal.create(data)
    }

    // async getByProposal(id){
    //     return await MuseProposal.findOne({where: {id}})
    // }
    async getByUser(userId){
        return MuseProposal.findOne({where: {subscriber_id: userId}})
    }

    async getById(id){
        return await MuseProposal.findOne({where: {id, polling_status: "open"}})
    }

    async getAll(){
        return await MuseProposal.findAll({include: [{
            model: MuseProposalPolling,
            as: "poll_data"
        }]})
    }

    async update(id, data){
        return await MuseProposal.update(data, {where: {id}})
    }
}

module.exports = new MuseProposalRepository();
const MuseProposalRepository = require('../repositories/MuseProposalRepository')

class MuseProposalService{
    async createProposal(data){
        const proposalExist = await MuseProposalRepository.getByUser(data.subscriber_id)
        if(proposalExist){
            return {code: 409, message: "You have already created proposal"}
        }
        return await MuseProposalRepository.create(data)
    }

    async getAllProposal(){
        return await MuseProposalRepository.getAll()
    }

    async updateProposal(id, data){
        return await MuseProposalRepository.update(id, data)
    }
}

module.exports = new MuseProposalService()
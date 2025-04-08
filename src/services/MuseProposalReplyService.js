const MuseProposalReplyRepo = require('../repositories/MuseProposalReplyRepo')

class MuseProposalReplyService{
    async createProposalReply(data){
        return await MuseProposalReplyRepo.create(data)
    }

    async getAllProposalReply(){
        return await MuseProposalReplyRepo.getAll()
    }

    async getAllApprovedReply(){
        return await MuseProposalReplyRepo.getAllApproved()
    }

    async updateProposalReply(id, data){
        return await MuseProposalReplyRepo.update(id, data)
    }

    async deleteProposalReply(id, data){
        return await MuseProposalReplyRepo.delete(id)
    }
}

module.exports = new MuseProposalReplyService()
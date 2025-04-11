const MuseProposalRepository = require('../repositories/MuseProposalRepository')
const MuseProposalPollingRepository = require('../repositories/MuseProposalPollingRepository')
const MuseProposalReplyRepo = require('../repositories/MuseProposalReplyRepo')
const { sequelize } = require('../models'); // adjust path to where sequelize is exported


class MuseProposalService {
    async createProposal(data) {
        const proposalExist = await MuseProposalRepository.getByUser(data.subscriber_id)
        if (proposalExist) {
            return { code: 409, message: "You have already created proposal" }
        }
        return await MuseProposalRepository.create(data)
    }

    async getProposalById(id){
        const response= await MuseProposalRepository.getById(id)
        if(!response){
            return {code: 404, message: "Proposal not found"}
        }
        return response;
    }

    async getAllProposal() {
        return await MuseProposalRepository.getAll()
    }

    async getApprovedProposal() {
        return await MuseProposalRepository.getApprovedProposal()
    }

    async getShoutOutShortlist(){
        return await MuseProposalRepository.getShoutOutShortlist()
    }

    async getShoutOutWinner(){
        const response = await MuseProposalRepository.getWinner()
        if(!response){
            return {code: 404, message: "Proposal not found"}
        }
        return response;
    }

    async updateProposal(id, data) {
        return await MuseProposalRepository.update(id, data)
    }

    async deleteProposal(id, type) {
        let transaction;
        transaction = await sequelize.transaction();
        try {
            switch (type) {
                case "proposal":
                    await MuseProposalPollingRepository.deleteByProposalId(id, transaction);
                    await MuseProposalReplyRepo.deleteByProposalId(id, transaction);
                    await MuseProposalRepository.delete(id, transaction);
                    break;

                case "poll":
                    await MuseProposalPollingRepository.delete(id)
                    break;
                case "question":
                    await MuseProposalReplyRepo.delete(id)
            }
            await transaction.commit();
            return;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }

}

module.exports = new MuseProposalService()
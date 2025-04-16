const MuseProposalRepository = require('../repositories/MuseProposalRepository')
const MuseProposalPollingRepository = require('../repositories/MuseProposalPollingRepository')
const MuseProposalReplyRepo = require('../repositories/MuseProposalReplyRepo')
const { sequelize } = require('../models'); // adjust path to where sequelize is exported
const { timeRangeCalculator } = require('../utils/subscriptionUtils')


class MuseProposalService {
    async createProposal(data, role) {
        console.log(data, role)
        if (role === "user") {
            const proposalExist = await MuseProposalRepository.getByUser(data.subscriber_id)
            if (proposalExist) {
                return { code: 409, message: "You have already created proposal" }
            }
        }
        return await MuseProposalRepository.create(data)
    }

    async getProposalById(id) {
        const response = await MuseProposalRepository.getById(id)
        if (!response) {
            return { code: 404, message: "Proposal not found" }
        }
        return response;
    }

    async getAllProposal() {
        return await MuseProposalRepository.getAll()
    }

    async getApprovedProposal() {
        return await MuseProposalRepository.getApprovedProposal()
    }

    async getShoutOutShortlist() {
        return await MuseProposalRepository.getShoutOutShortlist()
    }

    async getShoutOutWinner() {
        let pollWinner = await MuseProposalRepository.getWinner()
        if (!pollWinner) {
            return { code: 404, message: "Proposal not found" }
        }
        let replyWinner = await MuseProposalReplyRepo.getWinner()
        let response = [pollWinner, replyWinner]
        response = response.filter(item => {
            const timeDiff = timeRangeCalculator(item?.winner_declared_at)
            if (timeDiff === 0) {
                return item
            }
        })

        return response;
    }

    // async getShoutOutWinnerForReply(id){
    //     const reply = await MuseProposalReplyRepo.getById(id)
    //     if(!reply){
    //         return {code: 404, message: "Reply data not found"}
    //     }
    //     const proposal = await MuseProposalRepository.getById(reply.proposal_id)
    //     if(!proposal){
    //         return {code: 404, message: "Proposal not found"}
    //     }
    //     return reply
    // }

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
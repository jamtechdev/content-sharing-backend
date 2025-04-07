const MuseProposalPollingRepository = require('../repositories/MuseProposalPollingRepository')
const MuseProposalRepository = require('../repositories/MuseProposalRepository')

class MuseProposalPollingService {
    async createPoll(data) {
        const pollExist = await MuseProposalPollingRepository.getByUser(data.user_id, data.proposal_id)
        const proposalExist = await MuseProposalRepository.getById(data.proposal_id)
        if (pollExist && proposalExist?.proposal_type === "poll" && proposalExist.status === "approved" ) {
            await MuseProposalPollingRepository.update(pollExist?.id, { vote: data.vote })
            let upvoteCount
            if (pollExist.vote === "no" && data.vote === "yes") {
                upvoteCount = proposalExist?.upvote_count + 1
            }
            else if (pollExist.vote === "yes" && data.vote === "no") {
                upvoteCount = proposalExist?.upvote_count - 1
            }
            else { upvoteCount = proposalExist?.upvoteCount }

            const updateObj = {
                upvote_count: upvoteCount
            }
            await MuseProposalRepository.update(data.proposal_id, updateObj)
            return { code: 200, message: "Poll updated successfully" }
        }
        else {
            if (proposalExist && proposalExist.proposal_type === "poll" && proposalExist.status === "approved") {
                const upvoteCount = data.vote === "yes" ? proposalExist?.upvote_count + 1 : proposalExist?.upvote_count;
                const totalVoteCount = proposalExist?.total_vote_count + 1;
                const updateObj = {
                    total_vote_count: totalVoteCount,
                    upvote_count: upvoteCount
                }
                await MuseProposalRepository.update(data.proposal_id, updateObj)
                return await MuseProposalPollingRepository.create(data)
            }
            return {code: 400, message: "Proposal not found for voting"}
        }
    }

    async getAllPoll() {
        return await MuseProposalPollingRepository.getAll()
    }

    async updatePoll(id, data) {
        const pollExist = await MuseProposalPollingRepository.getById(id)
        const proposalExist = await MuseProposalRepository.getById(pollExist.proposal_id)
        if (proposalExist && proposalExist.status === "selected") {
            const totalVoteCount = data.vote === "yes" && proposalExist.total_vote_count + 1;

            await MuseProposalRepository.update(data.proposal_id, { vote_count: vote })
        }
        return await MuseProposalPollingRepository.update(id, data)
    }
}

module.exports = new MuseProposalPollingService()
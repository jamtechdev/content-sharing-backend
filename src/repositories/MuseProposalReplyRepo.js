const db = require('../models/index')
const MuseProposal = db.muse_proposal;
const MuseProposalReply = db.muse_proposal_replies


class MuseProposalReplyRepo {
    async create(data) {
        return await MuseProposalReply.create(data)
    }

    async getById(id) {
        return await MuseProposalReply.findOne({ where: { id } })
    }

    async getAll() {
        return await MuseProposalReply.findAll({})
    }

    async getAllApproved(){
        return await MuseProposalReply.findAll({
            where: {status: "approved"}
        })
    }
    async update(id, data) {
        return await MuseProposalReply.update(data, { where: { id } })
    }

    async delete(id) {
        return await MuseProposalReply.destroy({ where: { id } })
    }
}

module.exports = new MuseProposalReplyRepo();
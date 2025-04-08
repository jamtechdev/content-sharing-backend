const db = require('../models/index')
const MuseProposal = db.muse_proposal;
const MuseProposalPolling = db.muse_proposal_polling


class MuseProposalRepository {
    async create(data) {
        return await MuseProposal.create(data)
    }

    // async getByProposal(id){
    //     return await MuseProposal.findOne({where: {id}})
    // }
    async getByUser(userId) {
        return MuseProposal.findOne({ where: { subscriber_id: userId } })
    }

    async getById(id) {
        return await MuseProposal.findOne({ where: { id } })
    }

    async getAll() {
        return await MuseProposal.findAll({
            include: [{
                model: MuseProposalPolling,
                as: "poll_data"
            },
            {
                model: db.users,
                as: "profile",
                attributes: ["name", "avatar"]
            }
        ]
        })
    }

    async getApprovedProposal() {
        return await MuseProposal.findAll({
            where: {
                status: "approved", polling_status: "open"
            }, include: [{
                model: MuseProposalPolling,
                as: "poll_data"
            }]
        })
    }

    async update(id, data) {
        return await MuseProposal.update(data, { where: { id } })
    }

    async delete(id) {
        return await MuseProposal.destroy({ where: { id } })
    }
}

module.exports = new MuseProposalRepository();
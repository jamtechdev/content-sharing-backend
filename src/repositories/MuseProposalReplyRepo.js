const db = require('../models/index')
const MuseProposal = db.muse_proposal;
const MuseProposalReply = db.muse_proposal_replies
const {getLastMonthDateRange} = require('../utils/subscriptionUtils')

class MuseProposalReplyRepo {
    async create(data) {
        return await MuseProposalReply.create(data)
    }

    async getById(id) {
        return await MuseProposalReply.findOne({ where: { id } })
    }

    async getAll() {
        return await MuseProposalReply.findAll({
            include: [
                {
                    model: db.users,
                    as: "user",
                    attributes: ["name", "email", "avatar"]
                },
                {
                    model: db.muse_proposal,
                    as: "proposal",
                    attributes: { exclude: ["createdAt", "updatedAt", "id", "subscriber_id", "plan_id"] }
                },

            ]
        })
    }

    async getAllApproved() {
        return await MuseProposalReply.findAll({
            where: { status: "approved" }
        })
    }

   async getWinner() {
           const {startDate, endDate }= getLastMonthDateRange()
         return await MuseProposalReply.findOne({
             where: {
                 is_winner: true,
                 status: "approved",
                 createdAt: {
                     [db.Sequelize.Op.gte]: startDate,
                     [db.Sequelize.Op.lte]: endDate
                 },
             },
             include: [
                //  {
                //      model: db.users,
                //      as: "profile",
                //      attributes: ["id", "name", "email", "avatar"]
                //  },
                 {
                   model: MuseProposal,
                   as: "proposal"
                 }
             ]
         })
     }

    async update(id, data) {
        return await MuseProposalReply.update(data, { where: { id } })
    }

    async delete(id) {
        return await MuseProposalReply.destroy({ where: { id } })
    }

    async deleteByProposalId(id) {
        return await MuseProposalReply.destroy({ where: { proposal_id: id } })
    }
}

module.exports = new MuseProposalReplyRepo();
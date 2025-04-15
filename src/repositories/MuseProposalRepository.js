const db = require('../models/index')
const MuseProposal = db.muse_proposal;
const MuseProposalPolling = db.muse_proposal_polling
const MuseProposalReply = db.muse_proposal_replies;
const {getLastMonthDateRange, getCurrentMonthDateRange} = require('../utils/subscriptionUtils')


class MuseProposalRepository {
    async create(data) {
        return await MuseProposal.create(data)
    }

    // async getByProposal(id){
    //     return await MuseProposal.findOne({where: {id}})
    // }

    async getByUser(userId) {
        const {startDate, endDate} = getCurrentMonthDateRange()
        return MuseProposal.findOne({ where: { 
            createdAt: {
                [db.Sequelize.Op.gte]: startDate,
                [db.Sequelize.Op.lte]: endDate
            },
            subscriber_id: userId 
        } })
    }

    async getById(id) {
        return await MuseProposal.findOne({ where: { id, is_winner: false },  include: [
            {
                model: db.users,
                as: "profile",
                attributes: ["id", "name", "email", "avatar"]
            }
        ] })
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
                attributes: ["id", "name", "avatar", "role_id"],
                include: [
                    {
                        model: db.Roles,
                        as: "role",
                        attributes: ["name"]
                    }
                ]
            }
        ]})
    }

    async getApprovedProposal() {
        return await MuseProposal.findAll({
            where: {
                status: "approved", polling_status: "open"
            }, include: [
                {
                    model: MuseProposalPolling,
                    as: "poll_data"
                },
                {
                    model: db.users,
                    as: "profile",
                    attributes: ["id", "name", "email", "role_id"],
                    include: [
                        { 
                            model: db.Roles,
                            as: "role",
                            attributes: ["name"]
                        }
                    ]
                }
            ]
        })
    }

    async getShoutOutShortlist() {
          const {startDate, endDate }= getLastMonthDateRange()
          console.log("Current and end date", startDate, endDate)
        return await MuseProposal.findAll({
            where: {
                createdAt: {
                    [db.Sequelize.Op.gte]: startDate,
                    [db.Sequelize.Op.lte]: endDate
                },
            },
            order: [
                ['upvote_count', 'DESC']
            ],
            limit: 3,
            include: [
                {
                    model: db.users,
                    as: "profile",
                    attributes: ["id", "name", "email", "avatar"]
                }
            ]
        })
    }

    async getWinner() {
        const {startDate, endDate }= getLastMonthDateRange()
      return await MuseProposal.findAll({
          where: {
              is_winner: true,
              createdAt: {
                  [db.Sequelize.Op.gte]: startDate,
                  [db.Sequelize.Op.lte]: endDate
              },
          },
          include: [
              {
                  model: db.users,
                  as: "profile",
                  attributes: ["id", "name", "email", "avatar"]
              },
              {
                model: MuseProposalReply,
                as: "reply"
              }
          ]
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
const db = require('../models/index')
const ChatSession = db.chat_session;


class ChatSessionRepository {
    async create(sessionData){
        const data = {
            user_id: sessionData.user_id,
            model_id: sessionData.model_id,
            start_time: new Date(),
            duration: 10,
            status: "active"
        }

        return await ChatSession.create(data);
    }

    async getAll(){
        return await ChatSession.findAll({})
    }       

    async getById(id){
        return await ChatSession.findOne({where: {id}})
    }

    async getByUser(id){
        return await ChatSession.findOne({where: {user_id: id, status: "active"}})
    }

    async getActiveChatSession(modelId, userId){
        console.log("Chat session repo====>", modelId, userId)
        return await ChatSession.findOne({where: {model_id: modelId, user_id: userId, status: "active"}})
    }
    

    async endSession(sessionId){
        return await ChatSession.update(
          { status: 'ended', endTime: new Date() },
          { where: { id: sessionId } }
        );
    }

    async updateByUser(id, data){
        return await ChatSession.update(data, {where: {user_id: id}})
    }

    async update(id, data){
        return await ChatSession.update(data, {where: {id}})
    }
}

module.exports = new ChatSessionRepository();
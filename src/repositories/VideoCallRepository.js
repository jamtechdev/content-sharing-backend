const db = require('../models/index')

const VideoCall = db.video_call;




class VideoCallRepository {
    async create(data){
        return await VideoCall.create(data)
    }

    async getById(id){
        return await VideoCall.findOne({where: {id}})
    }

    async getSpecificOngoingCall(caller_id, receiver_id){
        return await VideoCall.findOne({where: {caller_id, receiver_id}})
    }

    async update(data, caller_id, receiver_id){
        return await VideoCall.update(data, {where: {
            caller_id, receiver_id
        }})
    }
}

module.exports = new VideoCallRepository()
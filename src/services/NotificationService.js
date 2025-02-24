const NotificationRepository = require("../repositories/NotificationRepository")

class NotificationService {
    async addToken(data){
        return await NotificationRepository.addToken(data)
    }

    async getTokenByUser(data){
        return await NotificationRepository.getTokenByUser(data)
    }

    async updateToken(data){
        return await NotificationRepository.updateToken(data)
    }

    async getOnlineUsers(){
        return await NotificationRepository.getOnlineUsers()
    }

    async addNotification(data){
        return await NotificationRepository.addNotification(data)
    }

    async getNotificationByRecieverId(userId){
        return await NotificationRepository.getNotificationByRecieverId(userId)
    }
}

module.exports = new NotificationService();
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
}

module.exports = new NotificationService();
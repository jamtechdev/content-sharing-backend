const SubscriptionRepository = require('../repositories/SubscriptionRepository')
const WildcardRevealRepository = require('../repositories/WildcardRevealRepository')
const {checkSubscriptionExpiry} = require('../utils/subscriptionUtils')

class WildcardRevealService {
    async createReveal(data) {
        return await WildcardRevealRepository.create(data)
    }

    async getRevealById(id) {
        return await WildcardRevealRepository.getById(id)
    }

    async getByRandomId(subscriberId) {
        const revealContent = await WildcardRevealRepository.getAll()
        const contentIds = revealContent.map(item => item.id);
        const id = Math.ceil(Math.random() * revealContent.length-1);
        const content = await WildcardRevealRepository.getById(contentIds[id])
        const {status, subscription} = await checkSubscriptionExpiry(subscriberId)
        let diffInDays = new Date() - subscription?.last_wildcard_reveal
        diffInDays = Math.floor(diffInDays/(24 * 60 * 60 * 1000))
    
        if(status === "expired" || diffInDays < 30){
            return {code: 400, message: "No wildcard reveal for you!"}
        }
        else {
            await SubscriptionRepository.update(subscription.id, {last_wildcard_reveal: new Date()})
            return content;
        }
    }

    async getAllReveals() {
        return await WildcardRevealRepository.getAll()
    }

    async updateReveal(id, data) {
        return await WildcardRevealRepository.update(id, data)
    }
}

module.exports = new WildcardRevealService()
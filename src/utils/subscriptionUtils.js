const SubscriptionRepository = require('../repositories/SubscriptionRepository')

module.exports.premiumWindowCalculator = (contentGrantDate) => {
    // let quarterDays = 90;
    let millisecondsInADay = 24 * 60 * 60 * 1000
    let now = new Date()
    let timeDiff = Math.ceil((contentGrantDate - now)/ millisecondsInADay)

    // const remainingDays = Math.floor(quarterDays - (timeDiff / millisecondsInADay))
    console.log("Remaining days to unlock on premium content=======>", timeDiff)
    return timeDiff
}

module.exports.checkSubscriptionExpiry = async(id)=>{
    const now = new Date()
    const subscription = await SubscriptionRepository.getByUser(id)
    if(now > subscription.end_date){
        return {status: "expired"}
    }
    return {status: "active", subscription}
}
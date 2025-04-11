const SubscriptionRepository = require('../repositories/SubscriptionRepository')

module.exports.premiumWindowCalculator = (contentGrantDate) => {
    // let quarterDays = 90;
    let millisecondsInADay = 24 * 60 * 60 * 1000
    let now = new Date()
    let timeDiff = Math.ceil((contentGrantDate - now) / millisecondsInADay)

    // const remainingDays = Math.floor(quarterDays - (timeDiff / millisecondsInADay))
    console.log("Remaining days to unlock on premium content===>", timeDiff)
    return timeDiff
}

module.exports.checkSubscriptionExpiry = async (id) => {
    const now = new Date()
    const subscription = await SubscriptionRepository.getByUser(id)
    if (now > subscription.end_date) {
        return { status: "expired" }
    }
    return { status: "active", subscription }
}

module.exports.getLastMonthDateRange = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); 
    const currentYear = currentDate.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const startDate = new Date(prevYear, prevMonth, 1);
    
    // Get the last day of the previous month by setting the day to 0 on the next month.
    // This gives the correct last day of the previous month.
    const endDate = new Date(prevYear, prevMonth + 2, 0); // This gives the last day of the previous month.

    // Normalize to local timezone if needed
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
};

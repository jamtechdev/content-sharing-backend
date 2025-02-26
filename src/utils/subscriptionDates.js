// utils/subscriptionDates.js

const getSubscriptionDates = (startTimestamp, duration) => {
  if (!startTimestamp || !duration) {
    throw new Error("startTimestamp and duration are required");
  }
  const startDate = new Date(startTimestamp * 1000);
  const endDate = new Date(startDate);
  switch (duration) {
    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "quarterly":
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid duration type");
  }
  return {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  };
};

module.exports = getSubscriptionDates;

const db = require("../models/index");
const Subscription = db.Subscription;
const cron = require("node-cron");

const subscriptionExpiryUpdateCronJob = async () => {
  const transaction = await db.sequelize.transaction();
  try {
    const currentDate = new Date();
    const expiredSubscriptions = await Subscription.findAll({
      where: {
        status: "active",
        end_date: { [db.Sequelize.Op.lt]: currentDate },
      },
      transaction,
    });

    if (expiredSubscriptions.length > 0) {
      const subscriptionIds = expiredSubscriptions.map((sub) => sub.id);
      const response = await Subscription.update(
        { status: "expired" },
        {
          where: { id: { [db.Sequelize.Op.in]: subscriptionIds } },
          transaction,
        }
      );

      await transaction.commit();
      console.info(`Updated ${response[0]} subscription(s)`);
    } else {
      await transaction.commit();
    }
  } catch (error) {
    await transaction.rollback();
    console.error("An error occurred while checking subscription status:", error);
  }
};

exports.cronJob = async () => {
  const cronSchedule = process.env.SUBSCRIPTION_CRON_SCHEDULE || "0 * * * * *";
  cron.schedule(cronSchedule, async () => {
    try {
      console.log("<----- Cron job scheduled for every 1 minute ----->")
      await subscriptionExpiryUpdateCronJob();
    } catch (error) {
      console.error("Cron job failed:", error);
    }
  });
};
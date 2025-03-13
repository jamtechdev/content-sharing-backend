const messaging = require("../firebase.js");
const NotificationService = require("../services/NotificationService.js");

/**
 * Sends push notifications to online users (excluding a specific user).
 *
 * @param {number} sender_id
 * @param {string} title
 * @param {string} message
 * @param {string|null} type
 * @param {number|null} content_id
 * @returns {Object}
 */
const pushNotification = async (dataPayload) => {
  try {
    const onlineUsers = await NotificationService.getOnlineUsers();

    const filteredUsers = onlineUsers.filter(
      (user) => user.user_id !== dataPayload.sender_id
    );
    const devicesToken = filteredUsers.map((user) => user.token);

    if (devicesToken.length === 0) {
      return {
        success: false,
        message: "No users available for notification.",
      };
    }

    const payload = {
      notification: {
        title: dataPayload?.title,
        body: dataPayload?.message,
        image: dataPayload?.media[0]?.url ? dataPayload?.media[0]?.url : "",
      },
      data: {
        type: dataPayload?.type || "",
        item_id: dataPayload?.content_id ? `${dataPayload?.content_id}` : "0",
        sender_id: `${dataPayload?.sender_id}`,
        url: "https://about.gitlab.com/images/press/git-cheat-sheet.pdf",
      },
      tokens: devicesToken,
    };

    const response = await messaging.sendEachForMulticast(payload);

    const notificationsToSave = response.responses
      .map((res, index) => {
        if (res.success) {
          return {
            title: dataPayload?.title,
            message: dataPayload?.message,
            sender_id: dataPayload?.sender_id,
            receiver_id: filteredUsers[index].user_id,
            is_read: false,
            type: dataPayload?.type || "system",
            item_id: dataPayload?.item_id,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null values
    console.log(notificationsToSave, "notification payload");

    if (notificationsToSave.length > 0) {
      await NotificationService.addNotification(notificationsToSave);
    }

    return { success: true, message: "Notifications sent successfully." };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, message: "Failed to send notifications." };
  }
};

module.exports = pushNotification;

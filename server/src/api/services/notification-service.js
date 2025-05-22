import notificationModel from "../models/notification-model.js";

const getManyNotificationsByUserId = async (userId, options) => {
  try {
    const notifications = await notificationModel.getManyNotificationsByUserId(userId, {
      ...options,
      unread: options.unread === "true"
    });
    const unreadCount = await notificationModel.countUnreadNotificationsByUserId(userId);

    return { unreadCount, notifications };
  } catch (err) {
    throw err;
  }
};

const markOneNotificationAsRead = async (notificationId, userId) => {
  try {
    await notificationModel.markOneNotificationAsRead(notificationId, userId);

    return notificationId;
  } catch (err) {
    throw err;
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    await notificationModel.markAllNotificationsAsRead(userId);

    return userId;
  } catch (err) {
    throw err;
  }
};

const deleteOneNotification = async (notificationId, userId) => {
  try {
    await notificationModel.deleteOneNotificationById(notificationId, userId);

    return notificationId;
  } catch (err) {
    throw err;
  }
};

const deleteAllNotifications = async (userId) => {
  try {
    await notificationModel.deleteAllNotificationsByUserId(userId);

    return userId;
  } catch (err) {
    throw err;
  }
};

export default {
  getManyNotificationsByUserId,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOneNotification,
  deleteAllNotifications
};

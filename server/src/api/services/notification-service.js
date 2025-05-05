import { StatusCodes } from "http-status-codes";
import notificationModel from "../models/notification-model.js";
import ApiError from "../../utils/api-error.js";
import { emitNewNotification } from "../../socket/notification-socket.js";

const createOneNotification = async (data) => {
  try {
    const { user_id, title, content, reference_type, reference_id } = data;

    const notificationData = {
      user_id,
      title,
      content,
      reference_type,
      reference_id
    };

    const notificationId = await notificationModel.createOneNotification(notificationData);

    if (!notificationId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the notification");
    }

    const notification = await notificationModel.getOneNotificationById(notificationId);

    emitNewNotification(user_id, notification);

    return notification;
  } catch (err) {
    throw err;
  }
};

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
  createOneNotification,
  getManyNotificationsByUserId,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOneNotification,
  deleteAllNotifications
};

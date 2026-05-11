import { StatusCodes } from "http-status-codes";
import notificationModel from "../models/notification-model.js";
import ApiError from "../../utils/api-error.js";
import { emitNewNotification, emitNotificationUpdate } from "../../socket/notification-socket.js";

const createAndSendNotification = async (data) => {
  try {
    const { user_id, content, type, reference_id } = data;

    if (!user_id || !content || !type) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required notification fields (user_id, content, type)");
    }

    const notificationData = {
        user_id,
        content,
        type,
        reference_id: reference_id || null
    };

    const newNotification = await notificationModel.createOneNotification(notificationData);

    if (!newNotification) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create notification in database");
    }

    emitNewNotification(user_id, newNotification);
    console.log(`Notification created and emitted via WebSocket for user ${user_id}.`);

    return newNotification;
  } catch (err) {
    console.error("Error in createAndSendNotification:", err);
    throw err instanceof ApiError ? err : new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "An error occurred while creating the notification");
  }
};

const groupNotifications = (notifications) => {
  if (!notifications || notifications.length === 0) {
    return [];
  }

  const groupedNotifications = [];
  let buffer = [];

  const processBuffer = () => {
    if (buffer.length > 1) {
      const first = buffer[0];
      const groupCount = buffer.length;
      let groupedContent = `${groupCount} new updates for reference ${first.reference_id}`;
      if (first.type === 'new_comment' && first.reference_id) {
            groupedContent = `(${groupCount}) ${buffer[buffer.length-1].content}`;
      }

      groupedNotifications.push({
        ...first,
        id: `group_${first.type}_${first.reference_id}_${first.created_at.toISOString()}`,
        content: groupedContent,
        is_grouped: true,
        grouped_ids: buffer.map(n => n.id),
        created_at: buffer[buffer.length-1].created_at,
      });
    } else if (buffer.length === 1) {
      groupedNotifications.push(buffer[0]);
    }
    buffer = [];
  };

  notifications.sort((a, b) => {
      const refCompare = (a.reference_id || 0) - (b.reference_id || 0);
      if (refCompare !== 0) return refCompare;
      const typeCompare = (a.type || '').localeCompare(b.type || '');
      if (typeCompare !== 0) return typeCompare;
      return new Date(a.created_at) - new Date(b.created_at);
  });


  for (let i = 0; i < notifications.length; i++) {
    const current = notifications[i];

    const canGroup = (notif) =>
      notif.type === 'new_comment' &&
      notif.reference_id !== null &&
      notif.reference_id === current.reference_id;

    if (buffer.length === 0) {
        if (canGroup(current)) {
            buffer.push(current);
        } else {
            groupedNotifications.push(current);
        }
    } else {
      const firstInBuffer = buffer[0];
      const timeDiff = Math.abs(new Date(current.created_at) - new Date(firstInBuffer.created_at));
      const maxTimeDiff = 60 * 60 * 1000;
      if (canGroup(current) && current.type === firstInBuffer.type && current.reference_id === firstInBuffer.reference_id && timeDiff < maxTimeDiff) {
          buffer.push(current);
      } else {
          processBuffer();
          if (canGroup(current)) {
              buffer.push(current);
          } else {
              groupedNotifications.push(current);
          }
      }
    }
  }

  processBuffer();

  groupedNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return groupedNotifications;
};


const getNotificationsForUser = async (userId, queryParams) => {
  try {
    const options = {
        onlyUnread: queryParams.unread === 'true',
        limit: parseInt(queryParams.limit, 10) || 20,
        offset: parseInt(queryParams.offset, 10) || 0,
    };

    const rawNotifications = await notificationModel.getManyNotificationsByUserId(userId, options);
    const unreadCount = await notificationModel.countUnreadNotificationsByUserId(userId);

    const processedNotifications = groupNotifications(rawNotifications);

    return { notifications: processedNotifications, unreadCount };
  } catch (err) {
    console.error(`Error fetching notifications for user ${userId}:`, err);
    throw err instanceof ApiError ? err : new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to fetch notifications");
  }
};

const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const updatedId = await notificationModel.markNotificationAsRead(notificationId, userId);
    if (!updatedId) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Notification with id '${notificationId}' not found or you don't have permission.`);
    }

    emitNotificationUpdate(userId, { type: 'read', id: updatedId });
    console.log(`Notification ${updatedId} marked as read and update emitted via WebSocket.`);

    return updatedId;
  } catch (err) {
     console.error(`Error marking notification ${notificationId} as read for user ${userId}:`, err);
     throw err instanceof ApiError ? err : new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to mark notification as read");
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    const count = await notificationModel.markAllNotificationsAsRead(userId);

    if (count > 0) {
        emitNotificationUpdate(userId, { type: 'read_all' });
        console.log(`Marked ${count} notifications as read for user ${userId} and update emitted via WebSocket.`);
    } else {
        console.log(`No unread notifications to mark as read for user ${userId}.`);
    }

    return count;
  } catch (err) {
     console.error(`Error marking all notifications as read for user ${userId}:`, err);
     throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to mark all notifications as read");
  }
};

const deleteNotification = async (userId, notificationId) => {
  try {
    const deletedCount = await notificationModel.deleteOneNotificationById(notificationId, userId);

    if (deletedCount === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Notification with id '${notificationId}' not found or you don't have permission.`);
    }

    emitNotificationUpdate(userId, { type: 'delete', id: notificationId });
    console.log(`Notification ${notificationId} deleted for user ${userId} and update emitted via WebSocket.`);

    return notificationId;
  } catch (err) {
     console.error(`Error deleting notification ${notificationId} for user ${userId}:`, err);
     throw err instanceof ApiError ? err : new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to delete notification");
  }
};

const deleteAllNotifications = async (userId) => {
    try {
        const deletedCount = await notificationModel.deleteAllNotificationsByUserId(userId);

        if (deletedCount > 0) {
             emitNotificationUpdate(userId, { type: 'delete_all' });
             console.log(`Deleted ${deletedCount} notifications for user ${userId} and update emitted via WebSocket.`);
        } else {
            console.log(`No notifications to delete for user ${userId}.`);
        }

        return deletedCount;
    } catch (err) {
        console.error(`Error deleting all notifications for user ${userId}:`, err);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Failed to delete all notifications");
    }
};

export default {
  createAndSendNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
import { db } from "../../config/db.js";

const createOneNotification = async (notificationData) => {
  try {
    const [notification] = await db("notifications")
      .insert({
          user_id: notificationData.user_id,
          content: notificationData.content,
          type: notificationData.type,
          reference_id: notificationData.reference_id || null,
          is_read: false
      })
      .returning("*");
    return notification;
  } catch (err) {
    throw new Error(`Error creating notification: ${err.message}`);
  }
};

const getManyNotificationsByUserId = async (user_id, options = {}) => {
  const { onlyUnread = false, limit = 20, offset = 0 } = options;
  try {
    let query = db("notifications")
      .select(
          "id",
          "user_id",
          "content",
          "type",
          "reference_id",
          "is_read",
          "created_at"
        )
      .where("user_id", user_id);

    if (onlyUnread) {
      query = query.andWhere("is_read", false);
    }

    const notifications = await query
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    return notifications;
  } catch (err) {
    throw new Error(`Error fetching notifications: ${err.message}`);
  }
};

const countUnreadNotificationsByUserId = async (user_id) => {
    try {
        const result = await db("notifications")
            .count("id as unread_count")
            .where({ user_id, is_read: false })
            .first();

        return parseInt(result.unread_count || 0, 10);
    } catch (err) {
        throw new Error(`Error counting unread notifications: ${err.message}`);
    }
};


const markNotificationAsRead = async (id, user_id) => {
  try {
    const [notification] = await db("notifications")
      .where({ id, user_id })
      .update({ is_read: true })
      .returning("id");
    return notification ? notification.id : null;
  } catch (err) {
    throw new Error(`Error marking notification as read: ${err.message}`);
  }
};

const markAllNotificationsAsRead = async (user_id) => {
  try {
    const result = await db("notifications")
      .where({ user_id, is_read: false })
      .update({ is_read: true });
    return result;
  } catch (err) {
    throw new Error(`Error marking all notifications as read: ${err.message}`);
  }
};

const deleteOneNotificationById = async (id, user_id) => {
  try {
    const deletedCount = await db("notifications")
      .where({ id: id, user_id: user_id })
      .del();
    return deletedCount;
  } catch (err) {
    throw new Error(`Error deleting notification: ${err.message}`);
  }
};

const deleteAllNotificationsByUserId = async (user_id) => {
    try {
        const deletedCount = await db("notifications")
            .where({ user_id: user_id })
            .del();
        return deletedCount;
    } catch (err) {
        throw new Error(`Error deleting all notifications for user: ${err.message}`);
    }
};


export default {
  createOneNotification,
  getManyNotificationsByUserId,
  countUnreadNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOneNotificationById,
  deleteAllNotificationsByUserId, 
};
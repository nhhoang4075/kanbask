import { db } from "../../config/db.js";

const createOneNotification = async (data) => {
  try {
    const [notification] = await db("notifications").insert(data).returning("id");

    return notification.id;
  } catch (err) {
    throw new Error(err);
  }
};

const getOneNotificationById = async (id) => {
  try {
    const notification = db("notifications").select("*").where({ id }).first();

    return notification;
  } catch (err) {
    throw new Error(err);
  }
};

const getManyNotificationsByUserId = async (user_id, options = {}) => {
  try {
    const { limit = 20, offset = 0, unread = false } = options;

    let query = db("notifications").select("*").where("user_id", user_id);

    if (unread) {
      query = query.andWhere("is_read", false);
    }

    const notifications = await query.orderBy("created_at", "desc").limit(limit).offset(offset);

    return notifications;
  } catch (err) {
    throw new Error(err);
  }
};

const countUnreadNotificationsByUserId = async (user_id) => {
  try {
    const result = await db("notifications")
      .count("id AS unread_count")
      .where({ user_id, is_read: false })
      .first();

    return parseInt(result.unread_count || 0, 10);
  } catch (err) {
    throw new Error(err);
  }
};

const markOneNotificationAsRead = async (id, user_id) => {
  try {
    const [notification] = await db("notifications")
      .where({ id, user_id })
      .update({ is_read: true })
      .returning("id");

    return notification.id;
  } catch (err) {
    throw new Error(err);
  }
};

const markAllNotificationsAsRead = async (user_id) => {
  try {
    const result = await db("notifications")
      .where({ user_id, is_read: false })
      .update({ is_read: true })
      .returning("id");

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteOneNotificationById = async (id, user_id) => {
  try {
    const [notification] = await db("notifications")
      .where({ id, user_id })
      .delete()
      .returning("id");

    return notification.id;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteAllNotificationsByUserId = async (user_id) => {
  try {
    const result = await db("notifications").where({ user_id }).delete().returning("id");

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  createOneNotification,
  getOneNotificationById,
  getManyNotificationsByUserId,
  countUnreadNotificationsByUserId,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOneNotificationById,
  deleteAllNotificationsByUserId
};

import { StatusCodes } from "http-status-codes";
import notificationService from "../services/notification-service.js";

const getNotificationsOfUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const options = req.query;

    const { unreadCount, notifications } = await notificationService.getManyNotificationsByUserId(
      userId,
      options
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        unread_count: unreadCount,
        notifications
      }
    });
  } catch (error) {
    next(error);
  }
};

const markOneNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const id = await notificationService.markOneNotificationAsRead(notificationId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Marked notification ${id} as read`
    });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await notificationService.markAllNotificationsAsRead(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Marked all notifications of user ${userId} as read`
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const id = await notificationService.deleteOneNotification(notificationId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted notification ${id} successfully`
    });
  } catch (error) {
    next(error);
  }
};

const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await notificationService.deleteAllNotifications(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted all notifications of user ${userId} successfully`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNotificationsOfUser,
  markOneNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOneNotification,
  deleteAllNotifications
};

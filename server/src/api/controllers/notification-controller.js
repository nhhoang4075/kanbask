import { StatusCodes } from "http-status-codes";
import notificationService from "../services/notification-service.js";

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const queryParams = req.query;

    const { notifications, unreadCount } = await notificationService.getNotificationsForUser(userId, queryParams);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        notifications,
        unread_count: unreadCount
      },
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id, 10);

    const updatedId = await notificationService.markNotificationAsRead(userId, notificationId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Notification ${updatedId} marked as read.`,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.markAllNotificationsAsRead(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Marked ${count} notifications as read.`,
    });
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { user_id, content, type, reference_id } = req.body;

    const notificationData = {
      user_id,
      content,
      type,
      reference_id
    };

    const newNotification = await notificationService.createAndSendNotification(notificationData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newNotification,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id, 10);

    const deletedId = await notificationService.deleteNotification(userId, notificationId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Notification ${deletedId} deleted successfully.`,
    });

  } catch (error) {
    next(error);
  }
};

const deleteAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const deletedCount = await notificationService.deleteAllNotifications(userId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Deleted all (${deletedCount}) notifications successfully.`,
            data: {
                deleted_count: deletedCount
            }
        });

    } catch (error) {
        next(error);
    }
};


export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  deleteAllNotifications, 
};
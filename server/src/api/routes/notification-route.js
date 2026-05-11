import notificationController from "../controllers/notification-controller.js";
import notificationValidation from "../validations/notification-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const notificationRoute = (router) => {
  router.use("/notifications", authMiddleware.authenticate);

  router
    .route("/notifications")
    .get(notificationValidation.validateGetNotifications, notificationController.getNotifications)
    .post(notificationValidation.validateCreateNotification, notificationController.createNotification);

  router
    .route("/notifications/all")
    .delete(notificationController.deleteAllNotifications);

  router
    .route("/notifications/read-all")
    .put(notificationController.markAllAsRead);

  router
    .route("/notifications/:id")
    .delete(notificationValidation.validateNotificationIdParam, notificationController.deleteNotification);

  router
    .route("/notifications/:id/read")
    .put(notificationValidation.validateNotificationIdParam, notificationController.markAsRead);

};

export default notificationRoute;
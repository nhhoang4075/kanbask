import notificationController from "../controllers/notification-controller.js";
import notificationValidation from "../validations/notification-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const notificationRoute = (router) => {
  router.use("/notifications", authMiddleware.authenticate);

  router
    .route("/notifications")
    .get(
      notificationValidation.validateNotificationsOptionsQuery,
      notificationController.getNotificationsOfUser
    )
    .put(notificationController.markAllNotificationsAsRead)
    .delete(notificationController.deleteAllNotifications);

  router
    .route("/notifications/:id")
    .put(
      notificationValidation.validateNotificationIdParam,
      notificationController.markOneNotificationAsRead
    )
    .delete(
      notificationValidation.validateNotificationIdParam,
      notificationController.deleteOneNotification
    );
};

export default notificationRoute;

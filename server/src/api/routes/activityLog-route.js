import activityLogController from "../controllers/activityLog-controller.js";
import activityLogValidation from "../validations/activityLog-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const activityLogRoute = (router) => {
  router.use("/log", authMiddleware.authenticate);

  router
    .route("/log")
    .get(activityLogController.getActivityLogsOfUser)
    .post(
      activityLogValidation.validateCreateActivityLog,
      activityLogController.createOneActivityLog
    );

  router
    .route("/log/:id")
    .get(
      activityLogValidation.validateActivityLogIdParam,
      activityLogController.getOneActivityLogById
    )
    .delete(
      activityLogValidation.validateActivityLogIdParam,
      activityLogController.delteteOneActivityLogById
    );
};

export default activityLogRoute;

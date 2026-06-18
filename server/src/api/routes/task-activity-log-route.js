import taskActivityLogController from "../controllers/task-activity-log-controller.js";
import taskActivityLogValidation from "../validations/task-activity-log-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const taskActivityLogRoute = (router) => {
  router.use("/logs", authMiddleware.authenticate);

  router
    .route("/logs/task")
    .get(
      taskActivityLogValidation.validateTaskIdQuery,
      taskActivityLogController.getActivityLogsOfTask
    );

  router
    .route("/logs/project")
    .get(
      taskActivityLogValidation.validateProjectIdQuery,
      taskActivityLogController.getActivityLogsOfProjectTasks
    );
};

export default taskActivityLogRoute;

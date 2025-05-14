import authMiddleware from "../../middlewares/auth-middleware.js";
import taskController from "../controllers/task-controller.js";
import taskValidation from "../validations/task-validation.js";

const taskRoute = (router) => {
  router.use("/tasks", authMiddleware.authenticate);

  router
    .route("/tasks")
    .post(taskValidation.validateCreateTask, taskController.createOneTask)
    .get(taskValidation.validateGetProjectTasks, taskController.getProjectTasks);

  router
    .route("/tasks/:task_id")
    .get(taskValidation.validateGetTaskById, taskController.getOneTaskById)
    .put(taskValidation.validateUpdateTaskInfo, taskController.updateOneTaskInfo)
    .delete(taskValidation.validateDeleteTask, taskController.deleteOneTaskById);

  router
    .route("/tasks/:task_id/position/:position")
    .put(taskValidation.validateUpdateTaskPosition, taskController.updateOneTaskPosition);
};

export default taskRoute;

import taskController from "../controllers/task-controller.js";
import taskValidation from "../validations/task-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";
import uploadMiddleware from "../../middlewares/upload-middleware.js";

const taskRoute = (router) => {
  router.use("/tasks", authMiddleware.authenticate);

  router
    .route("/tasks")
    .post(taskValidation.validateCreateTask, taskController.createOneTask)
    .get(taskValidation.validateProjectIdQuery, taskController.getTasksOfProject);

  router.route("/tasks/me").get(taskController.getMyAssignedTasks);

  router
    .route("/tasks/:id")
    .put(taskValidation.validateUpdateTask, taskController.updateOneTaskById)
    .delete(taskValidation.validateTaskIdParam, taskController.deleteOneTaskById);

  router
    .route("/tasks/:id/attachments")
    .post(
      taskValidation.validateTaskIdParam,
      uploadMiddleware.uploadAttachment.array("files"),
      taskController.uploadAttachmentsToTask
    )
    .get(taskValidation.validateTaskIdParam, taskController.getAttachmentsOfTask)
    .delete(taskValidation.validateDeleteTaskAttachments, taskController.deleteAttachmentsFromTask);
};

export default taskRoute;

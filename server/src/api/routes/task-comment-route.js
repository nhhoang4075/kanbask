import taskCommentController from "../controllers/task-comment-controller.js";
import taskCommentValidation from "../validations/task-comment-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const taskCommentRoute = (router) => {
  router.use("/task-comments", authMiddleware.authenticate);

  router
    .route("/task-comments")
    .post(
      taskCommentValidation.validateCreateTaskComment,
      taskCommentController.createOneTaskComment
    )
    .get(taskCommentValidation.validateTaskIdQuery, taskCommentController.getCommentsOfTask);

  router
    .route("/task-comments/:id")
    .put(
      taskCommentValidation.validateUpdateTaskComment,
      taskCommentController.updateOneTaskCommentById
    )
    .delete(
      taskCommentValidation.validateTaskCommentIdParam,
      taskCommentController.deleteOneTaskCommentById
    );
};

export default taskCommentRoute;

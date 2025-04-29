import taskCommentController from "../controllers/task-comment-controller.js";
import taskCommentValidation from "../validations/task-comment-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";  

const taskCommentRoute = (router) => {
router.use("/task-comments", authMiddleware.authenticate);
router.route("/task-comments/createcmt").post(taskCommentValidation.validateCreateComment, taskCommentController.createOneComment);
router.route("/task-comments/:taskId/getcmt").get(taskCommentValidation.validateGetCommentsByTaskId, taskCommentController.getCommentsByTaskId);
router.route("/task-comments/:id/updatecmt").put(taskCommentValidation.validateUpdateComment, taskCommentController.updateOneComment);
router.route("/task-comments/:id/deletecmt").delete(taskCommentValidation.validateDeleteComment, taskCommentController.deleteOneComment);
};

export default taskCommentRoute;
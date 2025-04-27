import authMiddleware from "../../middlewares/auth-middleware";
import taskController from "../controllers/task-controller";

const taskRoute = (router) => {
  router.use("/tasks", authMiddleware.authenticate);

  router.route("/tasks").post(taskController.createTask);

  router.route("/tasks/:task_id").put(taskController.updateTask);
};

export default taskRoute;

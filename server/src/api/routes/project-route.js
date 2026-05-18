import projectMiddleware from "../../middlewares/project-middleware.js";
import projectController from "../controllers/project-controller.js";
import projectValidation from "../validations/project-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const projectRoute = (router) => {
  router.use("/projects", authMiddleware.authenticate);

  router
    .route("/projects")
    .post(projectValidation.validateCreateProject, projectController.createProject);

  router.use("projects/:project_id", projectMiddleware.authorizeMember);

  router
    .route("/projects/:project_id")
    .get(projectValidation.validateProjectIdParam, projectController.getProjectById)
    .put(projectValidation.validateUpdateProject, projectController.updateProject);

  router
    .route("/projects/:project_id/members/:user_id")
    .all(projectMiddleware.authorizeAdmin)
    .post(projectValidation.validateProjectMemberParams, projectController.addUserToProject)
    .delete(projectValidation.validateProjectMemberParams, projectController.deleteUserFromProject)
    .put(projectValidation.validateUpdateUserProjectRole, projectController.updateUserProjectRole);
};

export default projectRoute;

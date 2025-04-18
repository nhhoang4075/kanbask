import projectMiddleware from "../../middlewares/project-middleware.js";
import projectController from "../controllers/project-controller.js";
import projectValidation from "../validations/project-validation.js";

const projectRoute = (router) => {
  router.use("/me", authMiddleware.authenticate);

  router
    .route("/me/projects/:projectId/members/:userId")
    .all(projectValidation.validateProjectMemberParams, projectMiddleware.authorizeAdmin)
    .post(projectController.addUserToProject)
    .delete(projectController.deleteUserFromProject)
    .put(projectValidation.validateUpdateUserProjectRole, projectController.updateUserProjectRole);

  router
    .route("/projects")
    .post(projectValidation.validateCreateProject, projectController.createProject);
};

export default projectRoute;

import projectController from "../controllers/project-controller.js";
import projectValidation from "../validations/project-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const projectRoute = (router) => {
  router.use("/projects", authMiddleware.authenticate);

  router
    .route("/projects")
    .get(projectValidation.validateTeamIdQuery, projectController.getProjectsOfUserInTeam)
    .post(projectValidation.validateCreateProject, projectController.createOneProject);

  router
    .route("/projects/:id")
    .put(projectValidation.validateUpdateProject, projectController.updateOneProjectById)
    .delete(projectValidation.validateProjectIdParam, projectController.deleteOneProjectById);

  router
    .route("/projects/:id/members")
    .get(projectValidation.validateProjectIdParam, projectController.getMembersOfProject)
    .post(projectValidation.validateUpdateProjectMembers, projectController.addMembersToProject)
    .delete(
      projectValidation.validateUpdateProjectMembers,
      projectController.removeMembersFromProject
    )
    .put(projectValidation.validateUpdateProjectRole, projectController.updateProjectRoleOfMember);
};

export default projectRoute;

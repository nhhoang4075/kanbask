import teamController from "../controllers/team-controller.js";
import teamValidation from "../validations/team-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const teamRoute = (router) => {
  router.use("/team", authMiddleware.authenticate);

  router
    .route("/teams")
    .get(teamController.getManyTeamsByUserId)
    .post(teamValidation.validateCreateTeam, teamController.createOneTeam);

  router
    .route("/teams/:id")
    .put(teamValidation.validateUpdateTeam, teamController.updateOneTeamById)
    .delete(teamValidation.validateTeamIdParam, teamController.deleteOneTeamById);

  router
    .route("/teams/:id/members")
    .get(teamValidation.validateTeamIdParam, teamController.getMembersOfTeam)
    // .post(teamValidation.validateAddMembers, teamController.addMembersToTeam)
    .delete(teamValidation.validateDeleteMembers, teamController.deleteMembersFromTeam)
    .put(teamValidation.validateUpdateRole, teamController.updateTeamRoleOfUser);
};

export default teamRoute;

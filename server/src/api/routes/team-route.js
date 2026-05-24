import teamController from "../controllers/team-controller.js";
import teamValidation from "../validations/team-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const teamRoute = (router) => {
  router.use("/teams", authMiddleware.authenticate);

  router
    .route("/teams")
    .get(teamController.getTeamsOfUser)
    .post(teamValidation.validateCreateTeam, teamController.createOneTeam);

  router
    .route("/teams/:id")
    .post(teamValidation.validateTeamIdParam, teamController.leaveOneTeamById)
    .put(teamValidation.validateUpdateTeam, teamController.updateOneTeamById)
    .delete(teamValidation.validateTeamIdParam, teamController.deleteOneTeamById);

  router
    .route("/teams/:id/members")
    .get(teamValidation.validateTeamIdParam, teamController.getMembersOfTeam)
    .delete(teamValidation.validateUpdateTeamMembers, teamController.removeMembersFromTeam)
    .put(teamValidation.validateUpdateTeamRole, teamController.updateTeamRoleOfMember);

  router.use("/team-requests", authMiddleware.authenticate);

  router
    .route("/team-requests")
    .get(teamValidation.validateTeamIdQuery, teamController.getManyTeamJoinRequestsOfTeam)
    .post(teamValidation.validateTeamCodeQuery, teamController.joinOneTeamByCode);

  router
    .route("/team-requests/:id")
    .post(teamValidation.validateTeamJoinRequestIdParam, teamController.approveTeamJoinRequest)
    .put(teamValidation.validateTeamJoinRequestIdParam, teamController.rejectTeamJoinRequest);
};

export default teamRoute;

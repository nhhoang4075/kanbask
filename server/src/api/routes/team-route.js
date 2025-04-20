import teamController from "../controllers/team-controller.js";
import teamValidation from "../validations/team-validation.js";


const teamRoute = (router) => {
  router.route("/teams/createteam").post(teamValidation.validateCreateTeam, teamController.createOneTeam);
  router.route("/teams/:userId/getteam").get( teamController.getTeamsByUserId);
  router.route("/teams/:teamId/getmembers").get(teamController.getMembersByTeamId);
  router.route("/teams/:teamId/addmembers").post(teamValidation.validateAddMembers,teamController.addMembersToTeam);
  router.route("/teams/:teamId/deletemembers").delete(teamValidation.validateDeleteMembers, teamController.deleteMembersFromTeam);
  router.route("/teams/:teamId/deleteteam").delete(teamValidation.validateDeleteTeam, teamController.deleteTeam);
  router.route("/teams/:teamId/addadmin").patch(teamValidation.validateAddAdmin, teamController.addAdmin);
};


export default teamRoute;
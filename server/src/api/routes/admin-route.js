import adminController from "../controllers/admin-controller.js";
import adminValidation from "../validations/admin-validation.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const adminRoute = (router) => {
  router.use("/admin", authMiddleware.authenticate, authMiddleware.authorizeAdmin);

  router.route("/admin/stats").get(adminController.getStats);
  router.route("/admin/health").get(adminController.getHealth);

  router.route("/admin/users").get(adminValidation.validateListQuery, adminController.listUsers);
  router
    .route("/admin/users/:id")
    .get(adminValidation.validateUserIdParam, adminController.getUserDetail);
  router
    .route("/admin/users/:id/role")
    .put(adminValidation.validateUpdateUserRole, adminController.updateUserRole);
  router
    .route("/admin/users/:id/status")
    .put(adminValidation.validateSetUserEnabled, adminController.setUserEnabled);
  router
    .route("/admin/users/:id/force-logout")
    .post(adminValidation.validateUserIdParam, adminController.forceLogoutUser);
  router
    .route("/admin/users/:id/resend-password-reset")
    .post(adminValidation.validateUserIdParam, adminController.resendPasswordReset);

  router.route("/admin/teams").get(adminValidation.validateListQuery, adminController.listTeams);
  router
    .route("/admin/teams/:id")
    .get(adminValidation.validateTeamIdParam, adminController.getTeamDetail);
  router
    .route("/admin/teams/:id/transfer-ownership")
    .post(adminValidation.validateTransferTeamOwnership, adminController.transferTeamOwnership);

  router
    .route("/admin/projects")
    .get(adminValidation.validateListQuery, adminController.listProjects);
  router
    .route("/admin/projects/:id")
    .get(adminValidation.validateProjectIdParam, adminController.getProjectDetail);
  router
    .route("/admin/projects/:id/transfer-ownership")
    .post(
      adminValidation.validateTransferProjectOwnership,
      adminController.transferProjectOwnership
    );
};

export default adminRoute;

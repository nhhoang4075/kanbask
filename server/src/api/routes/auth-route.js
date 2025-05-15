import authValidation from "../validations/auth-validation.js";
import authController from "../controllers/auth-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const authRoute = (router) => {
  router.route("/auth/register").post(authValidation.validateRegister, authController.register);

  router.route("/auth/login").post(authValidation.validateLogin, authController.login);

  router.use("/auth/me", authMiddleware.authenticate);
  router.route("/auth/me").get(authController.getSession);

  router.route("/auth/refresh").post(authController.refreshSession);

  router.use("/auth/logout", authMiddleware.authenticate);
  router.route("/auth/logout").post(authController.logout);

  router.use("/mail/verify-email", authMiddleware.authenticate);
  router.route("/mail/verify-email").post(authController.sendVerificationMail);

  router.use("/auth/verify-email", authMiddleware.authenticate);
  router
    .route("/auth/verify-email")
    .post(authValidation.validateVerificationCodeQuery, authController.verifyEmail);

  router
    .route("/mail/reset-password")
    .post(authValidation.validateEmailQuery, authController.sendPasswordResetMail);

  router
    .route("/auth/reset-password")
    .post(authValidation.validatePasswordReset, authController.resetPassword);
};

export default authRoute;

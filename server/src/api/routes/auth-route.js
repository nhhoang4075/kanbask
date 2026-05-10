import authValidation from "../validations/auth-validation.js";
import authController from "../controllers/auth-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const authRoute = (router) => {
  router.route("/auth/register").post(authValidation.validateRegister, authController.register);

  router.route("/auth/login").post(authValidation.validateLogin, authController.login);

  router.route("/auth/logout").put(authMiddleware.authenticate, authController.logout);

  router
    .route("/auth/verify-email")
    .get(authValidation.validateEmail, authController.sendVerificationMail)
    .put(authValidation.validateVerification, authController.verifyEmail);

  router
    .route("/auth/reset-password")
    .get(authValidation.validateEmail, authController.sendPasswordResetMail)
    .put(authValidation.validatePasswordReset, authController.resetPassword);

  router.route("/auth/refresh-token").get(authController.refreshAccessToken);
};

export default authRoute;

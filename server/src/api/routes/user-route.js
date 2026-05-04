// import userController from "../controllers/user-controller.js";
// import {
//   authenticateUser,
//   authorizeAdmin,
// } from "../../middlewares/auth-middleware.js";
// import {
//   validateRegister,
//   validateLogin,
//   validateUpdateProfile,
//   validateAdminUpdateProfile,
//   validateChangePassword,
//   validateForgotPassword,
//   validateResetPassword,
//   validateUserIdParam,
//   validateTokenParam,
//   validateResendVerification,
// } from "../validations/user-validation.js";

// const userRoute = (router) => {
//   // --- Public Routes ---
//   // router.post("/users/register", validateRegister, userController.register);
//   // router.put(
//   //   "/users/verify-email",
//   //   // validateTokenParam,
//   //   userController.verifyEmail
//   // );
//   // router.post("/users/login", validateLogin, userController.login);
//   // router.post(
//   //   "/users/forgot-password",
//   //   validateForgotPassword,
//   //   userController.forgotPassword
//   // );
//   // router.put(
//   //   "/users/reset-password/:token",
//   //   validateTokenParam,
//   //   validateResetPassword,
//   //   userController.resetPassword
//   // );
//   // router.post(
//   //   "/send-verification",
//   //   validateResendVerification,
//   //   userController.resendVerificationEmail
//   // );

//   // --- Authenticated Routes ---
//   // router.use(authenticateUser);

//   // router.post("/users/logout", userController.logout);
//   router.get("/users/me", userController.getMyProfile);
//   router.put(
//     "/users/me/profile",
//     validateUpdateProfile,
//     userController.updateMyProfile
//   );
//   router.put(
//     "/users/me/password",
//     validateChangePassword,
//     userController.changeMyPassword
//   );
//   router.delete("/users/me", userController.deleteMyAccount);

//   // --- Admin Routes ---

//   router.get("/users", authorizeAdmin, userController.getAllUsers);

//   router.get(
//     "/users/:userId",
//     authorizeAdmin,
//     validateUserIdParam,
//     userController.getUserById
//   );
//   router.delete(
//     "/users/:userId",
//     authorizeAdmin,
//     validateUserIdParam,
//     userController.deleteUserByAdmin
//   );
//   router.put(
//     "/users/:userId",
//     authorizeAdmin,
//     validateUserIdParam,
//     validateAdminUpdateProfile,
//     userController.updateUserByAdmin
//   );
// };

// export default userRoute;

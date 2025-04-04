<<<<<<< HEAD
import userController from "../controllers/user-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";
const { authenticate, authorizeAdmin } = authMiddleware;
import {
    validateUpdateProfile,
    validateChangePassword,
    validateUserIdParam,
    validateFindUserByEmail,
    validateAdminUpdateProfile
} from "../validations/user-validation.js";

const userRoute = (router) =>{
    router.use(authenticate);
    router.get("/users/me", userController.getMyProfile);
    router.put("/users/me/profile", validateUpdateProfile, userController.updateMyProfile);
    router.put("/users/me/password", validateChangePassword, userController.changeMyPassword);
    router.delete("/users/me", userController.deleteMyAccount);
    router.get("/users/find/id/:userId", validateUserIdParam, userController.findUserById);
    router.get("/users/find/email", validateFindUserByEmail, userController.findUserByEmail);
    router.use(authorizeAdmin);
    router.get("/users", userController.getAllUsers);
    router.get("/users/:userId", validateUserIdParam, userController.getUserByIdForAdmin);
    router.put("/users/:userId", validateAdminUpdateProfile, userController.updateUserByAdmin);
    router.delete("/users/:userId", validateUserIdParam, userController.deleteUserByAdmin);
}
export default userRoute;
=======
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
>>>>>>> a4649c7 (user with register and login)

import userValidation from "../validations/user-validation.js";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";

const userRoute = (router) => {
  router.use("/me", authMiddleware.authenticate);

  router.route("/me").get(userController.getMyAccount).delete(userController.deleteMyAccount);

  router
    .route("/me/profile")
    .put(userValidation.validateUpdateProfile, userController.updateMyProfile);

  router
    .route("/me/password")
    .put(userValidation.validateChangePassword, userController.changeMyPassword);

  router
    .route("/users")
    .get(userValidation.validateUserEmailQuery, userController.getOneUserByEmail);

  router
    .route("/users/:user_id")
    .get(userValidation.validateUserIdParam, userController.getOneUserById);

  router.use("/admin", authMiddleware.authenticate, authMiddleware.authorizeAdmin);

  router.route("/admin/users").get(userController.getAllUsers);

  router
    .route("/admin/users/:user_id")
    .put(userValidation.validateUpdateUserForAdmin, userController.updateOneUserForAdmin)
    .delete(userValidation.validateUserIdParam, userController.deleteOneUserForAdmin);
};

export default userRoute;

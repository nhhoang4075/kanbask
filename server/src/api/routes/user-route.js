import userValidation from "../validations/user-validation.js";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../../middlewares/auth-middleware.js";
import uploadMiddleware from "../../middlewares/upload-middleware.js";

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
    .route("/me/avatar")
    .put(uploadMiddleware.uploadImage.single("file"), userController.uploadMyAvatar);
};

export default userRoute;

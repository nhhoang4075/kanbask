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
import userController from "../controllers/user-controller.js";
import { authenticateUser, authorizeUserOrAdmin, authorizeAdmin } from "../../middlewares/auth-middleware.js";

const userRoute = (router) => {
  // Đăng ký người dùng
  router.post("/users/register", userController.register);

  // Đăng nhập người dùng
  router.post("/users/login", userController.login);

  // Cập nhật thông tin người dùng (Chỉ người dùng hiện tại hoặc admin)
  router.put("/profile/:userId", authenticateUser, authorizeUserOrAdmin, userController.updateProfile);

  // Đổi mật khẩu người dùng (Chỉ người dùng hiện tại)
  router.put("/change-password/:userId", authenticateUser, userController.changePassword);

  // Xóa tài khoản người dùng (Chỉ admin hoặc chính người dùng đó)
  router.delete("/:userId", authenticateUser, authorizeUserOrAdmin, userController.deleteUser);

  // Lấy thông tin người dùng (Chỉ admin hoặc người dùng đó)
  router.get("/:userId", authenticateUser, authorizeUserOrAdmin, userController.getUserById);

  // Lấy danh sách tất cả người dùng (Chỉ admin)
  router.get("/", authenticateUser, authorizeAdmin, userController.getAllUsers);
};

export default userRoute;
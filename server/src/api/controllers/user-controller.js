import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user-service.js";

// Đăng ký người dùng
const register = async (req, res, next) => {
  try {
    const { email, password, username, first_name, last_name, avatar_url } = req.body;
    const user = await userService.registerUser({ email, password, username, first_name, last_name, avatar_url });
    return res.status(StatusCodes.CREATED).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// Đăng nhập người dùng
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);
    return res.status(StatusCodes.OK).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// Cập nhật thông tin người dùng
const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updatedUser = await userService.updateProfile(userId, req.body);
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

// Đổi mật khẩu người dùng
export const changePassword = async (req, res, next) => {
  const { userId } = req.params;
  const { old_password, new_password } = req.body;

  try {
    await userService.changePassword(userId, old_password, new_password);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin người dùng
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(StatusCodes.OK).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(error);
  }
};

// Xóa tài khoản người dùng
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    return res.status(StatusCodes.NO_CONTENT).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  register,
  login,
  updateProfile,
  changePassword,
  getUserById,
  getAllUsers,
  deleteUser,
};
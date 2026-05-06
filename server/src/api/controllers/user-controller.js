import { StatusCodes } from "http-status-codes";
import userService from "../services/user-service.js";
import ApiError from "../../utils/api-error.js";

const getMyProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        return res.status(StatusCodes.OK).json({ success: true, data: { user } });
    } catch (error) { return next(error); }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    return res.status(StatusCodes.OK).json({ success: true, message: "Cập nhật hồ sơ thành công.", data : { user: updatedUser } });
  } catch (error) { return next(error); }
};

const changeMyPassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    await userService.changePassword(req.user.id, old_password, new_password);
    return res.status(StatusCodes.OK).json({ success: true, message: "Đổi mật khẩu thành công." });
  } catch (error) { return next(error); }
};

const deleteMyAccount = async (req, res, next) => {
    try {
        await userService.deleteUser(req.user.id, req.user.id, req.user.role);
        return res.status(StatusCodes.OK).json({ success: true, message: "Tài khoản của bạn đã được xóa." });
    } catch (error) { return next(error); }
};

const findUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await userService.getUserById(userId);
        return res.status(StatusCodes.OK).json({ success: true, data: { user } });
    } catch (error) { return next(error); }
};

const findUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        const user = await userService.findUserByEmailPublic(email);
        return res.status(StatusCodes.OK).json({ success: true, data: { user } });
    } catch (error) { return next(error); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(StatusCodes.OK).json({ success: true, data : { count: users.length, users } });
  } catch (error) { return next(error); }
};

const getUserByIdForAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await userService.getUserById(userId);
        return res.status(StatusCodes.OK).json({ success: true, data : { user } });
    } catch (error) { return next(error); }
};

const updateUserByAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updatedUser = await userService.updateUserByAdmin(req.user.id, userId, req.body);
        return res.status(StatusCodes.OK).json({ success: true, message: "Thông tin người dùng đã được cập nhật.", data : { user: updatedUser } });
    } catch (error) { return next(error); }
};

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) { throw new ApiError(StatusCodes.BAD_REQUEST, "Admin không thể tự xóa mình."); }
    await userService.deleteUser(userId, req.user.id, req.user.role);
    return res.status(StatusCodes.OK).json({ success: true, message: `Đã xóa người dùng (ID: ${userId}).` });
  } catch (error) { return next(error); }
};

export default {
  getMyProfile, 
  updateMyProfile, 
  changeMyPassword, 
  deleteMyAccount,
  findUserById, 
  findUserByEmail,
  getAllUsers, 
  getUserByIdForAdmin, 
  updateUserByAdmin, 
  deleteUserByAdmin
};
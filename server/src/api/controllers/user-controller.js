import { StatusCodes } from "http-status-codes";

import userService from "../services/user-service.js";
import ApiError from "../../utils/api-error.js";

const getMyAccount = async (req, res, next) => {
  try {
    const user = await userService.getOneUserById(req.user.id);

    res.status(StatusCodes.OK).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    await userService.updateUserProfile(req.user.id, req.body);

    res.status(StatusCodes.OK).json({ success: true, message: "Updated profile successfully" });
  } catch (error) {
    next(error);
  }
};

const changeMyPassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    await userService.changeUserPassword(req.user.id, old_password, new_password);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Changed password successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteMyAccount = async (req, res, next) => {
  try {
    await userService.deleteUserAccount(req.user.id);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Deleted account successfully" });
  } catch (error) {
    next(error);
  }
};

const getOneUserById = async (req, res, next) => {
  try {
    const user = await userService.getOneUserById(req.params.user_id);

    return res.status(StatusCodes.OK).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

const getOneUserByEmail = async (req, res, next) => {
  try {
    const user = await userService.getOneUserByEmail(req.query.email);

    return res.status(StatusCodes.OK).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(StatusCodes.OK).json({ success: true, data: { users } });
  } catch (error) {
    next(error);
  }
};

const updateOneUserForAdmin = async (req, res, next) => {
  try {
    const userId = await userService.updateOneUserForAdmin(req.params.user_id, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Admin only - Update user ${userId} successfully`
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneUserForAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    if (user_id === req.user.id) {
      next(new ApiError(StatusCodes.BAD_REQUEST, "Can not delete your account here"));
    }

    const userId = await userService.deleteOneUserForAdmin(user_id);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: `Admin only - Deleted user ${userId} successfully` });
  } catch (error) {
    next(error);
  }
};

export default {
  getMyAccount,
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount,
  getOneUserById,
  getOneUserByEmail,
  getAllUsers,
  updateOneUserForAdmin,
  deleteOneUserForAdmin
};

import { StatusCodes } from "http-status-codes";

import userService from "../services/user-service.js";

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

    res.status(StatusCodes.OK).json({ success: true, message: "Changed password successfully" });
  } catch (error) {
    next(error);
  }
};

const uploadMyAvatar = async (req, res, next) => {
  try {
    const avatar_url = await userService.uploadUserAvatar(req.user.id, req.file);

    res.status(StatusCodes.OK).json({ success: true, data: { avatar_url } });
  } catch (error) {
    next(error);
  }
};

const deleteMyAccount = async (req, res, next) => {
  try {
    await userService.deleteUserAccount(req.user.id);

    res.status(StatusCodes.OK).json({ success: true, message: "Deleted account successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getMyAccount,
  updateMyProfile,
  changeMyPassword,
  uploadMyAvatar,
  deleteMyAccount
};

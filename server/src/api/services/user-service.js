import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";

import UserModel from "../models/user-model.js";
import ApiError from "../../utils/api-error.js";
import embeddingProvider from "../../config/embedding-provider.js";
import supabaseProvider from "../../config/supabase-provider.js";
import { sanitizeUser, sanitizeAllowedFields } from "../../utils/helper.js";

const getOneUserById = async (userId) => {
  try {
    const user = await UserModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    return sanitizeUser(user);
  } catch (err) {
    throw err;
  }
};

const getOneUserByEmail = async (userEmail) => {
  try {
    const user = await UserModel.getOneUserByEmail(userEmail);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    return sanitizeUser(user);
  } catch (err) {
    throw err;
  }
};

const updateUserProfile = async (userId, data) => {
  try {
    const allowedData = sanitizeAllowedFields(data, ["full_name", "first_name", "last_name"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }
    const user = await UserModel.getOneUserById(userId);

    const textToEmbed = `${allowedData.full_name ?? user.full_name} ${user.email}`.trim();
    const userEmbedding = await embeddingProvider.generateEmbedding(textToEmbed);

    allowedData.embedding = userEmbedding;

    await UserModel.updateOneUserById(userId, allowedData);

    return userId;
  } catch (err) {
    throw err;
  }
};

const changeUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await UserModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordMatch) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Incorrect old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOneUserById(userId, { password_hash: hashedNewPassword });

    return userId;
  } catch (err) {
    throw err;
  }
};

export const uploadUserAvatar = async (userId, file) => {
  try {
    if (!file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No file provided");
    }

    const path = `avatars/${userId}`;
    const metadata = await supabaseProvider.uploadToStorage(file, path);

    const publicUrl = supabaseProvider.generatePublicUrl(metadata.supabase_path);

    await UserModel.updateOneUserById(userId, { avatar_url: publicUrl });

    return publicUrl;
  } catch (err) {
    throw err;
  }
};

const deleteUserAccount = async (userId) => {
  try {
    await UserModel.deleteOneUserById(userId);

    return userId;
  } catch (err) {
    throw err;
  }
};

export default {
  getOneUserById,
  getOneUserByEmail,
  updateUserProfile,
  uploadUserAvatar,
  changeUserPassword,
  deleteUserAccount
};

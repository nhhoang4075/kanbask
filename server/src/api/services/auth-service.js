import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import userModel from "../models/user-model.js";
import ApiError from "../../utils/api-error.js";
import { sendMail } from "../../config/mail-provider.js";
import { sanitizeUser } from "../../utils/helper.js";

const register = async (reqBody) => {
  try {
    const { email } = reqBody;

    const existedUser = await userModel.getOneUserByEmail(email);

    if (existedUser) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${email}' already exists`
      );
    }

    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    const user = await userModel.createOneUser({
      email,
      password_hash: hashedPassword,
      first_name: reqBody.first_name,
      last_name: reqBody.last_name
    });

    if (!user) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create user");
    }

    return sanitizeUser(user);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    const { email } = reqBody;

    const user = await userModel.getOneUserByEmail(email);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with email '${email}' haven't existed yet`);
    }

    const isPasswordMatched = await bcrypt.compare(reqBody.password, user.password_hash);

    if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const updatedUser = await userModel.updateOneUserById(user.id, {
      is_active: true
    });

    if (!updatedUser) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update user's active status"
      );
    }

    return sanitizeUser(user);
  } catch (error) {
    throw error;
  }
};

const logout = async (userId) => {
  try {
    const user = await userModel.getOneUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with id '${userId}' not found`);
    }

    const updatedUser = await userModel.updateOneUserById(user.id, {
      is_active: false,
      last_active: new Date().toISOString()
    });

    if (!updatedUser) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update user's active status"
      );
    }

    return sanitizeUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const sendVerificationMail = async (userEmail) => {
  try {
    const user = await userModel.getOneUserByEmail(userEmail);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${userEmail}' found to verify`
      );
    }

    if (user.email_verified) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${userEmail}' has already verified`
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedCode = await bcrypt.hash(code, 10);

    const updatedUser = await userModel.updateOneUserById(user.id, {
      verification_code: hashedCode,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
    });

    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create verification code");
    }

    const data = { user: { name: user.last_name }, verificationCode: code };

    await sendMail({
      email: user.email,
      subject: "Verify your account",
      template: "verification-mail.ejs",
      data
    });

    return sanitizeUser(user);
  } catch (error) {
    throw error;
  }
};

const verifyEmail = async (reqBody) => {
  try {
    const user = await userModel.getOneUserByEmail(reqBody.email);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${user.email}' found to verify`
      );
    }

    if (user.email_verified) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${user.email}' has already verified`
      );
    }

    const { verification_code, verification_expires } = user;

    if (!verification_expires || verification_expires < new Date().toISOString()) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Verification code has expired");
    }

    const isCodeMatched = await bcrypt.compare(reqBody.verification_code, verification_code);

    if (!isCodeMatched) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Verification code is not matched");
    }

    const updatedUser = await userModel.updateOneUserById(user.id, {
      email_verified: true,
      verification_code: null,
      verification_expires: null
    });

    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to verify user");
    }

    return sanitizeUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const sendPasswordResetMail = async (userEmail) => {
  try {
    const user = await userModel.getOneUserByEmail(userEmail);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `No user with email '${userEmail}' found`);
    }

    const code = uuidv4();

    const updateUser = await userModel.updateOneUserById(user.id, {
      password_reset_code: code,
      password_reset_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
    });

    if (!updateUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create password reset code");
    }

    const passwordResetUrl = `${process.env.CLIENT_ORIGIN}/auth/reset-password?code=${code}`;

    const data = { user: { name: user.last_name }, passwordResetUrl };

    await sendMail({
      email: user.email,
      subject: "Forgot your password",
      template: "password-reset-mail.ejs",
      data
    });

    return sanitizeUser(user);
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (reqBody) => {
  try {
    const user = await userModel.getOneUserByPasswordResetCode(reqBody.code);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Invalid password reset code`);
    }

    if (user.password_reset_expires < new Date().toISOString()) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Password reset code has expired");
    }

    const hashedNewPassword = await bcrypt.hash(reqBody.new_password, 10);

    const updatedUser = await userModel.updateOneUserById(user.id, {
      password_hash: hashedNewPassword,
      password_reset_code: null,
      password_reset_expires: null
    });

    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to reset user password");
    }

    return sanitizeUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  sendVerificationMail,
  verifyEmail,
  sendPasswordResetMail,
  resetPassword
};

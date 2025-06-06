import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import userModel from "../models/user-model.js";
import ApiError from "../../utils/api-error.js";
import mailProvider from "../../config/mail-provider.js";
import embeddingProvider from "../../config/embedding-provider.js";
import { sanitizeUser } from "../../utils/helper.js";

const register = async (data) => {
  try {
    const email = data.email.trim().toLowerCase();

    const existedUser = await userModel.getOneUserByEmail(email);
    if (existedUser) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${email}' already exists`
      );
    }

    const textToEmbed = `${data.full_name} ${email}`.trim();
    const userEmbedding = await embeddingProvider.generateEmbedding(textToEmbed);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userId = await userModel.createOneUser({
      email,
      password_hash: hashedPassword,
      full_name: data.full_name,
      embedding: userEmbedding
    });

    if (!userId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create user");
    }

    const user = await userModel.getOneUserById(userId);
    return sanitizeUser(user);
  } catch (err) {
    throw err;
  }
};

const login = async (data) => {
  try {
    const email = data.email.trim().toLowerCase();

    const existedUser = await userModel.getOneUserByEmail(email);
    if (!existedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with email '${email}' hasn't existed yet`);
    }

    const isPasswordMatched = await bcrypt.compare(data.password, existedUser.password_hash);
    if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    await userModel.updateOneUserById(existedUser.id, { is_active: true });

    const user = await userModel.getOneUserById(existedUser.id);
    return sanitizeUser(user);
  } catch (err) {
    throw err;
  }
};

const getSession = async (userId) => {
  try {
    const user = await userModel.getOneUserById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with id '${userId}' not found`);
    }
    return sanitizeUser(user);
  } catch (err) {
    throw err;
  }
};

const logout = async (userId) => {
  try {
    const user = await userModel.getOneUserById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `User with id '${userId}' not found`);
    }

    await userModel.updateOneUserById(user.id, {
      is_active: false,
      last_active: new Date().toISOString()
    });

    return userId;
  } catch (err) {
    throw err;
  }
};

const sendVerificationMail = async (userEmail) => {
  try {
    const email = userEmail.trim().toLowerCase();

    const user = await userModel.getOneUserByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `No user with email '${email}' found to verify`);
    }

    if (user.email_verified) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${email}' has already verified`
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);

    await userModel.updateOneUserById(user.id, {
      verification_code: hashedCode,
      verification_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 phút
    });

    const dataForMail = {
      user: { name: user.full_name },
      verificationCode: code
    };

    await mailProvider.sendMail({
      email: user.email,
      subject: "Verify your account",
      template: "verification-mail.ejs",
      data: dataForMail
    });

    return user.id;
  } catch (err) {
    throw err;
  }
};

const verifyEmail = async (userEmail, verificationCode) => {
  try {
    const email = userEmail.trim().toLowerCase();

    const user = await userModel.getOneUserByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `No user with email '${email}' found to verify`);
    }

    if (user.email_verified) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${email}' has already verified`
      );
    }

    const { verification_code, verification_expires } = user;
    if (!verification_expires || verification_expires < new Date().toISOString()) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Verification code has expired");
    }

    const isCodeMatched = await bcrypt.compare(verificationCode, verification_code);
    if (!isCodeMatched) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Verification code is not matched");
    }

    await userModel.updateOneUserById(user.id, {
      email_verified: true,
      verification_code: null,
      verification_expires: null
    });

    return user.id;
  } catch (err) {
    throw err;
  }
};

const sendPasswordResetMail = async (userEmail) => {
  try {
    const email = userEmail.trim().toLowerCase();

    const user = await userModel.getOneUserByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `No user with email '${email}' found`);
    }

    const code = uuidv4();
    await userModel.updateOneUserById(user.id, {
      password_reset_code: code,
      password_reset_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });

    const passwordResetUrl = `${process.env.CLIENT_ORIGIN}/auth/forgot-password?code=${code}`;
    const dataForMail = {
      user: { name: user.full_name },
      passwordResetUrl
    };

    await mailProvider.sendMail({
      email: user.email,
      subject: "Forgot your password",
      template: "password-reset-mail.ejs",
      data: dataForMail
    });

    return user.id;
  } catch (err) {
    throw err;
  }
};

const resetPassword = async (data) => {
  try {
    const user = await userModel.getOneUserByPasswordResetCode(data.code);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Invalid password reset code`);
    }

    if (user.password_reset_expires < new Date().toISOString()) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Password reset code has expired");
    }

    const hashedNewPassword = await bcrypt.hash(data.new_password, 10);

    await userModel.updateOneUserById(user.id, {
      password_hash: hashedNewPassword,
      password_reset_code: null,
      password_reset_expires: null
    });

    return user.id;
  } catch (err) {
    throw err;
  }
};

export default {
  register,
  login,
  getSession,
  logout,
  sendVerificationMail,
  verifyEmail,
  sendPasswordResetMail,
  resetPassword
};

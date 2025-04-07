import { StatusCodes } from "http-status-codes";
import ms from "ms";

import authService from "../services/auth-service.js";
import jwtProvider from "../../config/jwt-provider.js";

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      email_verified: user.email_verified
    };

    const accessToken = await jwtProvider.generateToken(
      userPayload,
      process.env.ACCESS_TOKEN_SECRET,
      "1h"
    );
    const refreshToken = await jwtProvider.generateToken(
      userPayload,
      process.env.REFRESH_TOKEN_SECRET,
      "7 days"
    );

    res.cookie("access_token", accessToken, {
      maxAge: ms("1h"),
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    res.cookie("refresh_token", refreshToken, {
      maxAge: ms("7 days"),
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const user = await authService.logout(req.user.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `User logged out successfully - Id: ${user.id}`
    });
  } catch (error) {
    return next(error);
  }
};

const sendVerificationMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.sendVerificationMail(email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Verification mail sent successfully to ${email}`
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await authService.verifyEmail(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email verified successfully - Id: ${user.id}`
    });
  } catch (error) {
    return next(error);
  }
};

const sendPasswordResetMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.sendPasswordResetMail(email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Password reset mail sent successfully to ${email}`
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const user = await authService.resetPassword(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Password reset successfully - Id: ${user.id}`
    });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "No refresh token provided");
    }

    const decodedRefreshToken = await jwtProvider.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const payload = {
      id: decodedRefreshToken.id,
      email: decodedRefreshToken.email,
      role: decodedRefreshToken.role,
      email_verified: decodedRefreshToken.email_verified
    };

    const accessToken = await jwtProvider.generateToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      "1h"
    );

    res.cookie("access_token", accessToken, {
      maxAge: ms("1h"),
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Refreshed access token"
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  register,
  login,
  logout,
  verifyEmail,
  sendVerificationMail,
  sendPasswordResetMail,
  resetPassword,
  refreshToken
};

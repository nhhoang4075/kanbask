import { StatusCodes } from "http-status-codes";
import ms from "ms";

import authService from "../services/auth-service.js";
import jwtProvider from "../../config/jwt-provider.js";
import ApiError from "../../utils/api-error.js";

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;

    const user = await authService.login({ email, password });

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      email_verified: user.email_verified
    };

    const accessToken = jwtProvider.generateToken(
      userPayload,
      process.env.ACCESS_TOKEN_SECRET,
      "1h"
    );

    res.cookie("access_token", accessToken, {
      maxAge: ms("1h"),
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    if (remember) {
      const refreshToken = jwtProvider.generateToken(
        userPayload,
        process.env.REFRESH_TOKEN_SECRET,
        "7 days"
      );

      res.cookie("refresh_token", refreshToken, {
        maxAge: ms("7 days"),
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSession = async (req, res, next) => {
  try {
    const user = await authService.getSession(req.user.id);

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: { user, expires_at: req.user.exp * 1000 } });
  } catch (error) {
    next(error);
  }
};

const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "No refresh token provided");
    }

    const decodedRefreshToken = jwtProvider.verifyToken(
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

    const accessToken = jwtProvider.generateToken(payload, process.env.ACCESS_TOKEN_SECRET, "1h");

    res.cookie("access_token", accessToken, {
      maxAge: ms("1h"),
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Refreshed session successfully"
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const userId = await authService.logout(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `User ${userId} logged out successfully`
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationMail = async (req, res, next) => {
  try {
    const userId = await authService.sendVerificationMail(req.user.email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Verification mail sent successfully to user ${userId}`
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const userId = await authService.verifyEmail(req.user.email, req.query.code);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Verified email successfully for user ${userId}`
    });
  } catch (error) {
    next(error);
  }
};

const sendPasswordResetMail = async (req, res, next) => {
  try {
    const userId = await authService.sendPasswordResetMail(req.query.email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Password reset mail sent successfully to user ${userId}`
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const userId = await authService.resetPassword(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Reset password successfully for user ${userId}`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getSession,
  refreshSession,
  logout,
  verifyEmail,
  sendVerificationMail,
  sendPasswordResetMail,
  resetPassword
};

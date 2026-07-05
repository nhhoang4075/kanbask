import { parse } from "cookie";
import { StatusCodes } from "http-status-codes";

import jwtProvider from "../config/jwt-provider.js";
import userModel from "../api/models/user-model.js";
import ApiError from "../utils/api-error.js";

// A still-valid access_token JWT only proves the user was enabled, had this
// token_version, and held this role at issuance time (up to 1h ago) — re-fetch
// the user so an admin's force-logout/disable-account/role-change takes effect
// immediately instead of only once the client happens to hit /auth/refresh.
const getActiveUserForToken = async (decoded) => {
  const user = await userModel.getOneUserById(decoded.id);

  if (!user || !user.is_enabled || user.token_version !== decoded.token_version) {
    return null;
  }

  return user;
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies ? req.cookies.access_token : null;

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this"));
    }

    const decoded = jwtProvider.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await getActiveUserForToken(decoded);

    if (!user) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, "Session has been revoked, please login again")
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: decoded.exp
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this"));
    }
    if (req.user.role !== "admin") {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Access denied. Admins only"));
    }

    next();
  } catch (error) {
    next(error);
  }
};

const authenticateSocket = async (socket, next) => {
  try {
    const rawCookies = socket.request.headers.cookie;
    const { access_token: token } = parse(rawCookies);

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Access token expired or not found"));
    }

    const decoded = jwtProvider.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await getActiveUserForToken(decoded);

    if (!user) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, "Session has been revoked, please login again")
      );
    }

    socket.data.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticate,
  authorizeAdmin,
  authenticateSocket
};

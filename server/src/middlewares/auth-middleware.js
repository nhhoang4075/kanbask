import { parse } from "cookie";
import { StatusCodes } from "http-status-codes";

import jwtProvider from "../config/jwt-provider.js";
import ApiError from "../utils/api-error.js";

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies ? req.cookies.access_token : null;

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this"));
    }

    const decoded = jwtProvider.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
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

    socket.data.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
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

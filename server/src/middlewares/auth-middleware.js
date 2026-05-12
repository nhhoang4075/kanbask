import { StatusCodes } from "http-status-codes";

import jwtProvider from "../config/jwt-provider.js";
import ApiError from "../utils/api-error.js";

const authenticate = (req, res, next) => {
  const token = req.cookies ? req.cookies.access_token : null;

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this resource"));
  }

  try {
    const decoded = jwtProvider.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this resource"));
    }
    if (req.user.role !== "admin") {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Access denied. Admins only"));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticate,
  authorizeAdmin
};

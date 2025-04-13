import { StatusCodes } from "http-status-codes";

import jwtProvider from "../config/jwt-provider.js";
import ApiError from "../utils/api-error.js";

// const SECRET_KEY = process.env.JWT_SECRET;
// const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "jwt_token";

const authenticate = (req, res, next) => {
  const token = req.cookies ? req.cookies.access_token : null;

  if (!token) {
    // Nếu không có token, trả lỗi 401 ngay vì các route sau middleware này đều cần xác thực
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this resource"));
  }

  try {
    const decoded = jwtProvider.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

    // Gắn thông tin cần thiết vào req.user
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next(); // Token hợp lệ, chuyển tiếp
  } catch (error) {
    return next(error);
  }
};

// Middleware kiểm tra quyền Admin
const authorizeAdmin = (req, res, next) => {
  try {
    // Phải được dùng SAU authenticateUser
    if (!req.user) {
      // Phòng trường hợp lạ
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Please login to access this resource"));
    }
    if (req.user.role !== "admin") {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Access denied. Admins only"));
    }

    next(); // Là admin, cho phép đi tiếp
  } catch (error) {
    return next(error);
  }
};

export default {
  authenticate,
  authorizeAdmin
};

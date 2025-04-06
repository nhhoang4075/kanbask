import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/api-error.js';

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'jwt_token';

export const authenticateUser = (req, res, next) => {
  const token = req.cookies ? req.cookies[JWT_COOKIE_NAME] : null;

  if (!token) {
    // Nếu không có token, trả lỗi 401 ngay vì các route sau middleware này đều cần xác thực
     return next(new ApiError(StatusCodes.UNAUTHORIZED, "Vui lòng đăng nhập để truy cập tài nguyên này."));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Gắn thông tin cần thiết vào req.user
    req.user = {
        id: decoded.userId,
        role: decoded.role
    };
    next(); // Token hợp lệ, chuyển tiếp
  } catch (error) {
     console.error("Authentication error:", error.message);
     // Xóa cookie không hợp lệ/hết hạn để tránh client gửi lại
     res.clearCookie(JWT_COOKIE_NAME, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

     if (error.name === 'TokenExpiredError') {
         return next(new ApiError(StatusCodes.UNAUTHORIZED, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."));
     }
     if (error.name === 'JsonWebTokenError') {
         return next(new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ."));
     }
     // Lỗi khác trong quá trình verify
     return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi xác thực token."));
  }
};

// Middleware kiểm tra quyền Admin
export const authorizeAdmin = (req, res, next) => {
  // Phải được dùng SAU authenticateUser
  if (!req.user) { // Phòng trường hợp lạ
       return next(new ApiError(StatusCodes.UNAUTHORIZED, "Chưa xác thực."));
  }
  if (req.user.role !== "admin") {
    return next(new ApiError(StatusCodes.FORBIDDEN, "Truy cập bị từ chối. Yêu cầu quyền Admin."));
  }
  next(); // Là admin, cho phép đi tiếp
};
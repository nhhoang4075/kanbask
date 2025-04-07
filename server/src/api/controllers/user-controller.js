import { StatusCodes } from "http-status-codes";
import userService from "../services/user-service.js";
import ApiError from "../../utils/api-error.js";

// --- Constants & Cookie Options ---
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'jwt_token';
const JWT_COOKIE_EXPIRES_IN_DAYS = parseInt(process.env.JWT_COOKIE_EXPIRES_IN_DAYS || '7', 10);
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000)
};

// --- Controller Functions ---

// Đăng ký người dùng
const register = async (req, res, next) => {
  try {
    const result = await userService.registerUser(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        message: result.message,
        userId: result.userId
      }
    });
  } catch (error) {
    return next(error); 
  }
};

// Xác thực email
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params; // Token từ URL
        const result = await userService.verifyUserEmail(token);
        return res.status(StatusCodes.OK).json({
            success: true,
            data : {
              message: result.message,
            }
        });
    } catch (error) {
        return next(error);
    }
};

// Đăng nhập người dùng
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);

    // Set JWT token in HTTP-Only Cookie
    res.cookie(JWT_COOKIE_NAME, token, cookieOptions);

    // Trả về thông tin user
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        message: "Đăng nhập thành công.",
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Đăng xuất người dùng
const logout = async (req, res, next) => {
    // Hàm này chạy sau authenticateUser nên req.user tồn tại
    const userId = req.user.id;

    try {
        // Cập nhật is_active = false trong DB
        await userService.logoutUser(userId);

        // Xóa cookie JWT
        res.clearCookie(JWT_COOKIE_NAME, { // Dùng clearCookie 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Trả về thành công
        res.status(StatusCodes.OK).json({ 
          success: true, 
          data : {
            message: 'Đăng xuất thành công.' 
          }
        });

    } catch (error) {
        console.error("Error during logout:", error);
        res.status(StatusCodes.OK).json({ 
          success: true, 
          data : {
            message: 'Đăng xuất thành công (có lỗi phụ xảy ra ở server).' 
          }
        });
    }
};

// Đặt lại mật khẩu
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await userService.requestPasswordReset(email);
        // Luôn trả về OK để tránh lộ thông tin email tồn tại
        return res.status(StatusCodes.OK).json({
            success: true,
            data : {
              message: result.message,
            }
        });
    } catch (error) {
        return next(error);
    }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const result = await userService.resetPassword(token, password);
        return res.status(StatusCodes.OK).json({
            success: true,
            data : {
              message: result.message,
            }
        });
    } catch (error) {
        return next(error);
    }
};

// Lấy thông tin cá nhân (người dùng hiện tại)
const getMyProfile = async (req, res, next) => {
    try {
        // ID người dùng lấy từ token (req.user.id)
        const user = await userService.getUserById(req.user.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            data : {
              user, 
            }
        });
    } catch (error) {
        return next(error);
    }
};


// Cập nhật thông tin cá nhân (người dùng hiện tại)
const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Service sẽ chỉ lấy các trường hợp lệ từ req.body
    const updatedUser = await userService.updateProfile(userId, req.body);
    return res.status(StatusCodes.OK).json({
      success: true,
      data : {
        message: "Cập nhật hồ sơ thành công.",
        user: updatedUser, 
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Đổi mật khẩu (người dùng hiện tại)
const changeMyPassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { old_password, new_password } = req.body;
    const result = await userService.changePassword(userId, old_password, new_password);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        message : result.message,
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tài khoản (người dùng hiện tại tự xóa)
const deleteMyAccount = async (req, res, next) => {
    try {
        const userIdToDelete = req.user.id;
        const result = await userService.deleteUser(userIdToDelete, req.user.id, req.user.role);

         // Xóa cookie sau khi xóa tài khoản
        res.clearCookie(JWT_COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
              message : result.message,
            }
        });
    } catch (error) {
        return next(error);
    }
};


// --- Admin Actions ---

// Lấy danh sách tất cả người dùng (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(); 
    return res.status(StatusCodes.OK).json({
      success: true,
      data : {
        count: users.length,
        users,
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Lấy thông tin người dùng theo ID (Admin)
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    return res.status(StatusCodes.OK).json({
      success: true,
      data : {
        user,
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Cập nhật thông tin người dùng bởi Admin
const updateUserByAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params; // ID user cần cập nhật
        const adminUserId = req.user.id; // ID của admin thực hiện
        const updatedUser = await userService.updateUserByAdmin(adminUserId, userId, req.body);
        return res.status(StatusCodes.OK).json({
            success: true,
            data : {
              message: "Cập nhật người dùng thành công.",
              user: updatedUser, 
            }
        });
    } catch (error) {
        return next(error);
    }
};

// Xóa tài khoản người dùng bởi Admin
const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params; // ID user cần xóa
    const requestingUserId = req.user.id;
    const requestingUserRole = req.user.role;

    // Ngăn admin tự xóa mình qua route này 
    if (userId === requestingUserId) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Admin không thể tự xóa mình qua endpoint này."));
    }

    const result = await userService.deleteUser(userId, requestingUserId, requestingUserRole);
    return res.status(StatusCodes.OK).json({
      success: true,
      data : {
        message: result.message,
      }
    });
  } catch (error) {
    return next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await userService.resendVerificationEmail(email);

    res.status(StatusCodes.OK).json({ 
      status: "success",
      message: "Nếu tài khoản của bạn tồn tại và chưa được xác thực, email xác thực mới đã được gửi.",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  // Public
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  forgotPassword,
  resetPassword,
  // Authenticated User
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount,
  logout,
  // Admin
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
};
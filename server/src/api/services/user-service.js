<<<<<<< HEAD
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error.js";
import UserModel from "../models/user-model.js";

const BCRYPT_SALT_ROUNDS = 10;

const sanitizeUser = (user) => {
    if (!user) return null;
    const sanitized = { ...user };
    delete sanitized.password_hash;
    delete sanitized.password_reset_code;
    delete sanitized.password_reset_expires;
    delete sanitized.verification_code;
    delete sanitized.verification_expires;
    return sanitized;
};

const getUserById = async (userId) => {
    try {
        const user = await UserModel.getOneUserById(userId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng.");
        }
        return sanitizeUser(user);
    } catch (error) {
        console.error(`Get User By ID Service Error (${userId}):`, error.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi lấy thông tin người dùng.");
    }
};

const findUserByEmailPublic = async (email) => {
    try {
        const user = await UserModel.getOneUserByEmail(email);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng với email này.");
        }
        return sanitizeUser(user);
    } catch (error) {
        console.error(`Find User By Email Public Service Error (${email}):`, error.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi tìm kiếm người dùng bằng email.");
    }
};

const updateProfile = async (userId, updateData) => {
    try {
        const allowedFields = ['first_name', 'last_name', 'avatar_url'];
        const dataToUpdate = {};
        allowedFields.forEach(field => { if (updateData[field] !== undefined) dataToUpdate[field] = updateData[field]; });
        if (Object.keys(dataToUpdate).length === 0) { throw new ApiError(StatusCodes.BAD_REQUEST, "Không có dữ liệu hợp lệ để cập nhật."); }

        const updatedUser = await UserModel.updateOneUserById(userId, dataToUpdate);
        if (!updatedUser) { throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng để cập nhật."); }
        return sanitizeUser(updatedUser);
    } catch (error) {
        console.error(`Update Profile Service Error (${userId}):`, error.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật hồ sơ.");
    }
};

const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await UserModel.getOneUserById(userId);
        if (!user || !user.password_hash) { throw new ApiError(StatusCodes.NOT_FOUND, "Không thể lấy thông tin mật khẩu hiện tại."); }

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) { throw new ApiError(StatusCodes.BAD_REQUEST, "Mật khẩu cũ không chính xác."); }

        const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        const updated = await UserModel.updateOneUserById(userId, { password_hash: hashedNewPassword });
        if (!updated) { throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Không thể cập nhật mật khẩu."); }
        return true;
    } catch (error) {
        console.error(`Change Password Service Error (${userId}):`, error.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi thay đổi mật khẩu.");
    }
};

const deleteUser = async (userIdToDelete, requestingUserId, requestingUserRole) => {
    try {
        if (requestingUserRole !== 'admin' && userIdToDelete !== requestingUserId) { throw new ApiError(StatusCodes.FORBIDDEN, "Không có quyền xóa người dùng này."); }
        if (requestingUserRole === 'admin' && userIdToDelete === requestingUserId) { throw new ApiError(StatusCodes.BAD_REQUEST, "Admin không thể tự xóa mình."); }

        const deletedUserInfo = await UserModel.deleteOneUserById(userIdToDelete);
        if (!deletedUserInfo || !deletedUserInfo.id) { throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng để xóa hoặc lỗi."); }
        return true;
    } catch (error) {
        console.error(`Delete User Service Error (Target: ${userIdToDelete}):`, error.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi xóa người dùng.");
    }
};

const getAllUsers = async () => {
    try {
        const users = await UserModel.getAllUsers();
        return users.map(sanitizeUser);
    } catch (error) {
        console.error("Get All Users Service Error:", error.message);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi lấy danh sách người dùng.");
    }
};

const updateUserByAdmin = async (adminUserId, userIdToUpdate, updateData) => {
    try {
        const allowedFields = ['first_name', 'last_name', 'avatar_url', 'role', 'is_enabled'];
        const dataToUpdate = {};
        allowedFields.forEach(field => { if (updateData[field] !== undefined) dataToUpdate[field] = updateData[field]; });
        if (Object.keys(dataToUpdate).length === 0) { throw new ApiError(StatusCodes.BAD_REQUEST, "Không có dữ liệu hợp lệ để cập nhật."); }
        if (userIdToUpdate === adminUserId && dataToUpdate.is_enabled === false) { throw new ApiError(StatusCodes.FORBIDDEN, "Admin không thể tự vô hiệu hóa chính mình."); }

        const updatedUser = await UserModel.updateOneUserById(userIdToUpdate, dataToUpdate);
        if (!updatedUser) { throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng để cập nhật."); }
        return sanitizeUser(updatedUser);
    } catch (error) {
        console.error(`Update User By Admin Service Error (Target: ${userIdToUpdate}):`, error.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi khi admin cập nhật người dùng.");
    }
};

export default {
    getUserById, 
    findUserByEmailPublic,
    updateProfile, 
    changePassword, 
    deleteUser,
    getAllUsers, 
    updateUserByAdmin
};
=======
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";
// import { StatusCodes } from "http-status-codes";

// import ApiError from "../../utils/api-error.js";
// import UserModel from "../models/user-model.js";
// import Mailer from "../../config/mailer.js";

// const SECRET_KEY = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN || "1h";

// // Hàm tạo JWT token
// const signToken = (userId, role) => {
//   return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
// };

// const sanitizeUser = (user) => {
//   if (!user) return null;
//   const sanitized = { ...user };
//   delete sanitized.password_hash;
//   delete sanitized.verification_token;
//   delete sanitized.verification_expires;
//   delete sanitized.reset_token;
//   delete sanitized.reset_token_expires;
//   return sanitized;
// };

// // Đăng ký người dùng mới
// const registerUser = async (userData) => {
//   try {
//     await UserModel.deleteUnverifiedUserByEmail(userData.email);
//     const existingUser = await UserModel.getUserByEmail(userData.email);
//     if (existingUser) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, "Email đã tồn tại");
//     }

//     const { user, verificationToken } = await UserModel.createUser(userData);

//     Mailer.sendVerificationEmail(user.email, verificationToken).catch((err) => {
//       console.error(
//         `Failed sending verification email to ${user.email} after registration:`,
//         err
//       );
//     });

//     return {
//       message:
//         "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
//       userId: user.id,
//     };
//   } catch (error) {
//     console.error("Register user service error:", error);
//     if (error instanceof ApiError) throw error;
//     if (error.message.includes("already exists")) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
//     }
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi trong quá trình đăng ký"
//     );
//   }
// };

// // Xác thực email
// const verifyUserEmail = async (token) => {
//   try {
//     const user = await UserModel.findUserByVerificationToken(token);
//     if (!user) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         "Mã xác thực không hợp lệ hoặc đã hết hạn."
//       );
//     }
//     await UserModel.setUserVerified(user.id);
//     return {
//       message: "Xác thực email thành công. Bạn có thể đăng nhập.",
//     };
//   } catch (error) {
//     console.error("Verify email service error:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi trong quá trình xác thực email."
//     );
//   }
// };

// // Đăng nhập người dùng
// const loginUser = async (email, password) => {
//   try {
//     const user = await UserModel.getUserByEmail(email);

//     if (!user || !(await bcrypt.compare(password, user.password_hash))) {
//       throw new ApiError(
//         StatusCodes.UNAUTHORIZED,
//         "Email hoặc mật khẩu không đúng."
//       );
//     }

//     if (!user.is_enabled) {
//       throw new ApiError(
//         StatusCodes.FORBIDDEN,
//         "Tài khoản của bạn đã bị khóa."
//       );
//     }

//     if (!user.email_verified) {
//       throw new ApiError(
//         StatusCodes.FORBIDDEN,
//         "Vui lòng xác thực địa chỉ email của bạn trước khi đăng nhập."
//       );
//     }

//     const token = signToken(user.id, user.role);

//     await Promise.all([
//       UserModel.updateLastLogin(user.id),
//       UserModel.setUserActiveStatus(user.id, true),
//     ]);

//     const userResponse = sanitizeUser(user);
//     if (userResponse) {
//       userResponse.last_login = new Date();
//       userResponse.is_active = true;
//     }

//     return { token, user: userResponse };
//   } catch (error) {
//     throw error;
//   }
// };

// // Đăng xuất người dùng (cập nhật DB)
// const logoutUser = async (userId) => {
//   try {
//     const success = await UserModel.setUserActiveStatus(userId, false);
//     if (!success) {
//       console.warn(`Failed to set user ${userId} inactive on logout.`);
//     }
//     return { message: "Cập nhật trạng thái logout thành công." };
//   } catch (error) {
//     console.error(`Logout user service error for ${userId}:`, error);
//     return { message: "Lỗi khi cập nhật trạng thái logout." };
//   }
// };

// // Yêu cầu đặt lại mật khẩu
// const requestPasswordReset = async (email) => {
//   try {
//     const user = await UserModel.getUserByEmail(email);
//     if (!user || !user.is_enabled) {
//       console.warn(
//         `Password reset requested for non-existent or disabled email: ${email}`
//       );
//       return {
//         message:
//           "Nếu email của bạn tồn tại và hợp lệ trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu.",
//       };
//     }

//     const resetToken = await UserModel.setResetToken(user.id);
//     Mailer.sendPasswordResetEmail(user.email, resetToken).catch((err) => {
//       console.error(
//         `Failed sending password reset email to ${user.email}:`,
//         err
//       );
//     });

//     return {
//       message:
//         "Nếu email của bạn tồn tại và hợp lệ trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu.",
//     };
//   } catch (error) {
//     console.error("Request password reset service error:", error);
//     return {
//       message:
//         "Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
//     };
//   }
// };

// // Đặt lại mật khẩu bằng token
// const resetPassword = async (token, newPassword) => {
//   try {
//     const user = await UserModel.findUserByResetToken(token);
//     if (!user) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
//       );
//     }
//     if (!user.is_enabled) {
//       throw new ApiError(
//         StatusCodes.FORBIDDEN,
//         "Không thể đặt lại mật khẩu cho tài khoản đang bị khóa."
//       );
//     }

//     await UserModel.resetPasswordWithToken(user.id, newPassword);
//     return {
//       message:
//         "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.",
//     };
//   } catch (error) {
//     console.error("Reset password service error:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi trong quá trình đặt lại mật khẩu."
//     );
//   }
// };

// // Cập nhật thông tin cá nhân (user tự cập nhật)
// const updateProfile = async (userId, data) => {
//   try {
//     const currentUser = await UserModel.getUserById(userId);
//     if (!currentUser) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại.");
//     }
//     const allowedUpdates = {
//       username: data.username,
//       first_name: data.first_name,
//       last_name: data.last_name,
//       avatar_url: data.avatar_url,
//     };
//     Object.keys(allowedUpdates).forEach(
//       (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
//     );

//     if (Object.keys(allowedUpdates).length === 0) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         "Không có thông tin hợp lệ để cập nhật."
//       );
//     }

//     const updatedUser = await UserModel.updateUserProfile(
//       userId,
//       allowedUpdates
//     );
//     if (!updatedUser) {
//       throw new ApiError(
//         StatusCodes.INTERNAL_SERVER_ERROR,
//         "Không thể cập nhật thông tin người dùng."
//       );
//     }
//     return sanitizeUser(updatedUser);
//   } catch (error) {
//     console.error("Update profile service error:", error);
//     if (error instanceof ApiError) throw error;
//     if (error.message.includes("already exists")) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
//     }
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi khi cập nhật hồ sơ."
//     );
//   }
// };

// // Thay đổi mật khẩu (user tự đổi)
// const changePassword = async (userId, oldPassword, newPassword) => {
//   try {
//     const success = await UserModel.changePassword(
//       userId,
//       oldPassword,
//       newPassword
//     );
//     if (!success) {
//       throw new ApiError(
//         StatusCodes.INTERNAL_SERVER_ERROR,
//         "Không thể thay đổi mật khẩu do lỗi không xác định."
//       );
//     }
//     return { message: "Đổi mật khẩu thành công." };
//   } catch (error) {
//     console.error("Change password service error:", error);
//     if (error instanceof ApiError) throw error;
//     if (error.message === "User not found")
//       throw new ApiError(StatusCodes.NOT_FOUND, error.message);
//     if (error.message === "Old password is incorrect")
//       throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi khi thay đổi mật khẩu."
//     );
//   }
// };

// // Lấy thông tin user theo ID
// const getUserById = async (userId) => {
//   try {
//     const user = await UserModel.getUserById(userId);
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại.");
//     }
//     return sanitizeUser(user);
//   } catch (error) {
//     console.error("Get user by ID service error:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi khi lấy thông tin người dùng."
//     );
//   }
// };

// // Lấy tất cả user (Admin)
// const getAllUsers = async () => {
//   try {
//     const users = await UserModel.getAllUsers();
//     return users.map((user) => sanitizeUser(user)); // Lọc thông tin nhạy cảm cho từng user
//   } catch (error) {
//     console.error("Get all users service error:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi khi lấy danh sách người dùng."
//     );
//   }
// };

// // Xóa user (Admin hoặc user tự xóa)
// const deleteUser = async (
//   userIdToDelete,
//   requestingUserId,
//   requestingUserRole
// ) => {
//   try {
//     if (requestingUserRole !== "admin" && userIdToDelete !== requestingUserId) {
//       throw new ApiError(
//         StatusCodes.FORBIDDEN,
//         "Bạn không có quyền xóa người dùng này."
//       );
//     }

//     const userExists = await UserModel.getUserById(userIdToDelete);
//     if (!userExists) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại.");
//     }

//     await UserModel.deleteUser(userIdToDelete);
//     return { message: "Xóa người dùng thành công." };
//   } catch (error) {
//     console.error("Delete user service error:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi khi xóa người dùng."
//     );
//   }
// };

// // Cập nhật user bởi Admin
// const updateUserByAdmin = async (adminUserId, userIdToUpdate, data) => {
//   try {
//     const userExists = await UserModel.getUserById(userIdToUpdate);
//     if (!userExists) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại.");
//     }

//     if (userIdToUpdate === adminUserId && data.is_enabled === false) {
//       throw new ApiError(
//         StatusCodes.FORBIDDEN,
//         "Admin không thể tự vô hiệu hóa chính mình qua endpoint này."
//       );
//     }

//     const allowedUpdates = {
//       username: data.username,
//       first_name: data.first_name,
//       last_name: data.last_name,
//       avatar_url: data.avatar_url,
//       role: data.role,
//       is_enabled: data.is_enabled,
//       email_verified: data.email_verified,
//     };
//     Object.keys(allowedUpdates).forEach(
//       (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
//     );

//     if (Object.keys(allowedUpdates).length === 0) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         "Không có thông tin hợp lệ để cập nhật."
//       );
//     }

//     const updatedUser = await UserModel.updateUserByAdmin(
//       userIdToUpdate,
//       allowedUpdates
//     );
//     if (!updatedUser) {
//       throw new ApiError(
//         StatusCodes.INTERNAL_SERVER_ERROR,
//         "Không thể cập nhật thông tin người dùng."
//       );
//     }
//     return sanitizeUser(updatedUser);
//   } catch (error) {
//     console.error("Update user by admin service error:", error);
//     if (error instanceof ApiError) throw error;
//     if (
//       error.message.includes("already exists") ||
//       error.message.includes("Invalid data")
//     ) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
//     }
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       error.message || "Lỗi khi cập nhật người dùng bởi admin."
//     );
//   }
// };

// /**
//  * Gửi lại email xác thực cho người dùng chưa xác thực.
//  * @param {string} email - Email của người dùng
//  */
// const resendVerificationEmail = async (email) => {
//   const user = await UserModel.getUserByEmail(email);

//   if (!user) {
//     console.warn(
//       `Resend verification request for non-existent email: ${email}`
//     );
//     return {
//       message:
//         "If your email address is registered, you will receive a new verification link shortly.",
//     };
//   }

//   if (user.email_verified) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       "This email address has already been verified."
//     );
//   }

//   // Tạo token và thời gian hết hạn mới
//   const newVerificationToken = crypto.randomBytes(6).toString("hex");
//   const newVerificationExpires = new Date(
//     Date.UTC(
//       new Date().getUTCFullYear(),
//       new Date().getUTCMonth(),
//       new Date().getUTCDate(),
//       new Date().getUTCHours(),
//       new Date().getUTCMinutes(),
//       new Date().getUTCSeconds(),
//       0
//     ) +
//       5 * 60 * 1000
//   );

//   // Cập nhật token mới vào database
//   await UserModel.setVerificationToken(
//     user.id,
//     newVerificationToken,
//     newVerificationExpires
//   );

//   // Gửi email với token mới
//   await Mailer.sendVerificationEmail(user.email, newVerificationToken);

//   return {
//     message: "A new verification link has been sent to your email address.",
//   };
// };

// export default {
//   registerUser,
//   verifyUserEmail,
//   loginUser,
//   logoutUser,
//   requestPasswordReset,
//   resetPassword,
//   updateProfile,
//   changePassword,
//   getUserById,
//   getAllUsers,
//   deleteUser,
//   updateUserByAdmin,
//   resendVerificationEmail,
// };
>>>>>>> a4649c7 (user with register and login)

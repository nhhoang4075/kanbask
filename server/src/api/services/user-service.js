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
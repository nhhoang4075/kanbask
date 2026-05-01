import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as UserModel from "../models/user-model.js";

const SECRET_KEY = process.env.JWT_SECRET;

// Đăng ký người dùng
export const registerUser = async ({ username, email, password, first_name, last_name, avatar_url }) => {
  const existingUser = await UserModel.getUserByEmail(email);
  if (existingUser) throw new Error("Email already in use");

  return await UserModel.createUser({ username, email, password, first_name, last_name, avatar_url });
};

// Đăng nhập
export const loginUser = async (email, password) => {
  const user = await UserModel.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
  await UserModel.updateLastLogin(user.id);

  return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role, last_login: new Date() } };
};

// Cập nhật user (chỉ cập nhật của chính mình)
export const updateProfile = async (userId, data) => {
  return await UserModel.updateUser(userId, data);
};

// Thay đổi mật khẩu người dùng
export const changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new Error("Old password and new password are required");
  }
  
  return await UserModel.changePassword(userId, oldPassword, newPassword);
};


// Xóa user (chỉ admin hoặc chính user đó mới được xóa)
export const deleteUser = async (userId) => {
  return await UserModel.deleteUser(userId);
};

export const getUserById = async (userId) => {
  // Logic để lấy thông tin người dùng theo userId
  const user = await UserModel.getUserById(userId);
  return user;
};

// Lấy danh sách user (chỉ admin)
export const getAllUsers = async () => {
  return await UserModel.getAllUsers();
};
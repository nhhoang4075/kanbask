import { sql } from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Tạo user mới
export const createUser = async ({ username, email, password, first_name, last_name, avatar_url }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const [user] = await sql`
    INSERT INTO users (id, username, email, password_hash, first_name, last_name, avatar_url, is_active)
    VALUES (${userId}, ${username}, ${email}, ${hashedPassword}, ${first_name}, ${last_name}, ${avatar_url}, true)
    RETURNING id, username, email, first_name, last_name, avatar_url, role, is_active, last_login, created_at, updated_at;
  `;

  return user;
};

// Lấy user theo email
export const getUserByEmail = async (email) => {
  const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
  return user;
};

// Lấy user theo ID
export const getUserById = async (id) => {
  const [user] = await sql`
    SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, last_login, created_at, updated_at
    FROM users WHERE id = ${id}
  `;
  return user;
};

// Cập nhật thông tin user
export const updateUser = async (id, { username, email, password, first_name, last_name, avatar_url }) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const [updatedUser] = await sql`
    UPDATE users
    SET username = COALESCE(${username}, username),
        email = COALESCE(${email}, email),
        password_hash = COALESCE(${hashedPassword}, password_hash),
        first_name = COALESCE(${first_name}, first_name),
        last_name = COALESCE(${last_name}, last_name),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, username, email, first_name, last_name, avatar_url, role, is_active, last_login, created_at, updated_at;
  `;
  return updatedUser;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  // Lấy thông tin người dùng theo userId
  const user = await sql`
    SELECT id, password_hash FROM users WHERE id = ${userId}
  `;
  
  if (!user) throw new Error("User not found");
  
  // Kiểm tra mật khẩu cũ có khớp hay không
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) throw new Error("Old password is incorrect");
  
  // Mã hóa mật khẩu mới
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
  // Cập nhật mật khẩu mới vào cơ sở dữ liệu
  await sql`
    UPDATE users SET password_hash = ${hashedNewPassword} WHERE id = ${userId}
  `;
  
  return true; // Thành công
};

// Xóa user
export const deleteUser = async (id) => {
  await sql`DELETE FROM users WHERE id = ${id}`;
};

// Cập nhật thời gian đăng nhập
export const updateLastLogin = async (id) => {
  await sql`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${id};
  `;
};

// Lấy danh sách user (Admin)
export const getAllUsers = async () => {
  return await sql`
    SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, last_login, created_at, updated_at
    FROM users
  `;
};
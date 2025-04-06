import { sql } from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import crypto from 'crypto';

// Cập nhật trạng thái is_active cho user
const setUserActiveStatus = async (userId, isActive) => {
    try {
        await sql`
            UPDATE users
            SET is_active = ${isActive},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId};
        `;
        return true;
    } catch (err) {
        console.error(`Error setting user active status for ${userId} to ${isActive}:`, err);
        return false;
    }
};

// Tạo user mới
const createUser = async ({ username, email, password, first_name, last_name, avatar_url }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 5 * 60 * 1000);

    const [user] = await sql`
      INSERT INTO users (
        id, username, email, password_hash, first_name, last_name, avatar_url,
        is_active, is_enabled, email_verified, verification_token, verification_expires, role
      )
      VALUES (
        ${userId}, ${username}, ${email}, ${hashedPassword}, ${first_name}, ${last_name}, ${avatar_url},
        false, true, false, ${verificationToken}, ${verificationExpires}, 'user'
      )
      RETURNING id, username, email, first_name, last_name, avatar_url, role, is_active, is_enabled, email_verified, last_login, created_at, updated_at;`;

    return { user, verificationToken };
  } catch (err) {
    if (err.message.includes('users_email_key')) throw new Error('Email already exists');
    if (err.message.includes('users_username_key')) throw new Error('Username already exists');
    console.error("Error creating user:", err);
    throw new Error('Database error during user creation');
  }
};

// Lấy user theo email
const getUserByEmail = async (email) => {
  try {
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    return user;
  } catch (err) {
    console.error("Error getting user by email:", err);
    throw new Error('Database error fetching user by email');
  }
};

// Lấy user theo ID
const getUserById = async (id) => {
  try {
    const [user] = await sql`
      SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, is_enabled, email_verified, last_login, created_at, updated_at
      FROM users WHERE id = ${id}
    `;
    return user;
  } catch (err) {
    console.error("Error getting user by ID:", err);
    throw new Error('Database error fetching user by ID');
  }
};

// Tìm user bằng verification token
const findUserByVerificationToken = async (token) => {
    try {
        const [user] = await sql`
            SELECT * FROM users
            WHERE verification_token = ${token} AND verification_expires > NOW()
        `;
        return user;
    } catch (err) {
        console.error("Error finding user by verification token:", err);
        throw new Error('Database error finding user by verification token');
    }
};

// Đặt trạng thái email_verified = true và xóa token
const setUserVerified = async (userId) => {
    try {
        const [user] = await sql`
            UPDATE users
            SET email_verified = true,
                verification_token = NULL,
                verification_expires = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
            RETURNING id, email_verified;
        `;
        return user;
    } catch (err) {
        console.error("Error setting user verified:", err);
        throw new Error('Database error verifying user email');
    }
};

// Tìm user bằng reset token
const findUserByResetToken = async (token) => {
    try {
        const [user] = await sql`
            SELECT * FROM users
            WHERE reset_token = ${token} AND reset_token_expires > NOW()
        `;
        return user;
    } catch (err) {
        console.error("Error finding user by reset token:", err);
        throw new Error('Database error finding user by reset token');
    }
};

// Lưu token đặt lại mật khẩu và thời gian hết hạn
const setResetToken = async (userId) => {
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000); 

        await sql`
            UPDATE users
            SET reset_token = ${resetToken},
                reset_token_expires = ${resetTokenExpires},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
        `;
        return resetToken;
    } catch (err) {
        console.error("Error setting reset token:", err);
        throw new Error('Database error setting reset token');
    }
};

// Cập nhật mật khẩu mới và xóa token đặt lại
const resetPasswordWithToken = async (userId, newPassword) => {
    try {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const [user] = await sql`
            UPDATE users
            SET password_hash = ${hashedNewPassword},
                reset_token = NULL,
                reset_token_expires = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
            RETURNING id;
        `;
        return user;
    } catch (err) {
        console.error("Error resetting password with token:", err);
        throw new Error('Database error resetting password');
    }
};


// Cập nhật thông tin user (profile)
const updateUserProfile = async (id, { username, first_name, last_name, avatar_url }) => {
  try {
    const [updatedUser] = await sql`
      UPDATE users
      SET
          username = COALESCE(${username !== undefined ? username : null}, username),
          first_name = COALESCE(${first_name !== undefined ? first_name : null}, first_name),
          last_name = COALESCE(${last_name !== undefined ? last_name : null}, last_name),
          avatar_url = COALESCE(${avatar_url !== undefined ? avatar_url : null}, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, username, email, first_name, last_name, avatar_url, role, is_active, is_enabled, email_verified, last_login, created_at, updated_at;
    `;
    return updatedUser;
  } catch (err) {
    if (err.message.includes('users_username_key')) throw new Error('Username already exists');
    console.error("Error updating user profile:", err);
    throw new Error('Database error updating user profile');
  }
};

// Thay đổi mật khẩu
const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const [user] = await sql`SELECT id, password_hash FROM users WHERE id = ${userId}`;
    if (!user) throw new Error("User not found");
    if (!user.password_hash) throw new Error("User password hash is missing");
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) throw new Error("Old password is incorrect");
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const result = await sql`UPDATE users SET password_hash = ${hashedNewPassword}, updated_at = CURRENT_TIMESTAMP WHERE id = ${userId} RETURNING id;`;
    if (result.count === 0) throw new Error("Failed to update password.");
    return true;
  } catch (err) {
    console.error("Error changing password:", err);
    if (err.message === "User not found" || err.message === "Old password is incorrect" || err.message === "Failed to update password.") throw err;
    throw new Error('Database error changing password');
  }
};

// Xóa user 
const deleteUser = async (id) => {
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id}`;
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error('Database error deleting user');
  }};

// Cập nhật thời gian đăng nhập
const updateLastLogin = async (id) => {
  try {
    await sql`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${id};`;
  } catch (err) {
    console.error("Error updating last login:", err);
  }
};

// Lấy danh sách user (Admin)
const getAllUsers = async () => {
  try {
    return await sql`
      SELECT id, username, email, first_name, last_name, avatar_url, role, is_active, is_enabled, email_verified, last_login, created_at, updated_at
      FROM users ORDER BY created_at DESC
    `;
  } catch (err) {
    console.error("Error getting all users:", err);
    throw new Error('Database error fetching all users');
  }
};

// (Admin) Cập nhật thông tin user bất kỳ
const updateUserByAdmin = async (id, { username, first_name, last_name, avatar_url, role, is_enabled, email_verified }) => {
    try {
        const [updatedUser] = await sql`
            UPDATE users
            SET
                username = COALESCE(${username !== undefined ? username : null}, username),
                first_name = COALESCE(${first_name !== undefined ? first_name : null}, first_name),
                last_name = COALESCE(${last_name !== undefined ? last_name : null}, last_name),
                avatar_url = COALESCE(${avatar_url !== undefined ? avatar_url : null}, avatar_url),
                role = COALESCE(${role !== undefined ? role : null}, role),
                is_enabled = COALESCE(${is_enabled !== undefined ? is_enabled : null}, is_enabled),
                email_verified = COALESCE(${email_verified !== undefined ? email_verified : null}, email_verified),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING id, username, email, first_name, last_name, avatar_url, role, is_active, is_enabled, email_verified, last_login, created_at, updated_at;
        `;
        return updatedUser;
    } catch (err) {
        if (err.message.includes('users_username_key')) throw new Error('Username already exists');
        if (err.message.includes('violates check constraint')) throw new Error('Invalid data provided for update (e.g., invalid role)');
        console.error("Error updating user by admin:", err);
        throw new Error('Database error updating user by admin');
    }
};

const setVerificationToken = async (userId, token, expires) => { 
  await sql`
    UPDATE users
    SET verification_token = ${token}, verification_expires = ${expires}
    WHERE id = ${userId} AND email_verified = false
  `; // Chỉ cập nhật nếu email chưa được xác thực
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  findUserByVerificationToken,
  setVerificationToken,
  setUserVerified,
  findUserByResetToken,
  setResetToken,
  resetPasswordWithToken,
  updateUserProfile,
  updateUserByAdmin,
  changePassword,
  deleteUser,
  updateLastLogin,
  getAllUsers,
  setUserActiveStatus 
};
// import Joi from "joi";
// import { StatusCodes } from "http-status-codes";
// import ApiError from "../../utils/api-error.js";

// const validate = (schema, property = "body") => {
//   return (req, res, next) => {
//     const { error, value } = schema.validate(req[property], {
//       abortEarly: false,
//       stripUnknown: true,
//     });

//     if (!error) {
//       next();
//     } else {
//       const errorMessage = error.details
//         .map((detail) => detail.message)
//         .join(", ");
//       next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)); // 422 Unprocessable Entity
//     }
//   };
// };

// // --- Schemas ---

// const registerSchema = Joi.object({
//   // username: Joi.string().alphanum().min(3).max(30).required().messages({
//   //   'string.base': 'Tên người dùng phải là chuỗi',
//   //   'string.alphanum': 'Tên người dùng chỉ được chứa ký tự chữ và số',
//   //   'string.min': 'Tên người dùng phải có ít nhất {#limit} ký tự',
//   //   'string.max': 'Tên người dùng không được vượt quá {#limit} ký tự',
//   //   'any.required': 'Tên người dùng là bắt buộc',
//   // }),
//   email: Joi.string().email().required().messages({
//     "string.base": "Email phải là chuỗi",
//     "string.email": "Email không hợp lệ",
//     "any.required": "Email là bắt buộc",
//   }),
//   password: Joi.string().min(6).required().messages({
//     "string.base": "Mật khẩu phải là chuỗi",
//     "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
//     "any.required": "Mật khẩu là bắt buộc",
//   }),
//   first_name: Joi.string().max(50).allow("", null).optional(), // Allow optional fields
//   last_name: Joi.string().max(50).allow("", null).optional(),
//   // avatar_url: Joi.string().uri().allow('', null).optional().messages({
//   //     'string.uri': 'URL ảnh đại diện không hợp lệ',
//   // }),
// });

// const loginSchema = Joi.object({
//   email: Joi.string().email().required().messages({
//     "string.email": "Email không hợp lệ",
//     "any.required": "Email là bắt buộc",
//   }),
//   password: Joi.string().required().messages({
//     "any.required": "Mật khẩu là bắt buộc",
//   }),
// });

// // User tự cập nhật profile (giới hạn các trường)
// const updateProfileSchema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(30).optional(),
//   first_name: Joi.string().max(50).allow("", null).optional(),
//   last_name: Joi.string().max(50).allow("", null).optional(),
//   avatar_url: Joi.string().uri().allow("", null).optional().messages({
//     "string.uri": "URL ảnh đại diện không hợp lệ",
//   }),
// })
//   .min(1)
//   .messages({
//     "object.min": "Cần cung cấp ít nhất một trường thông tin để cập nhật.",
//   });

// // Admin cập nhật profile (cho phép nhiều trường hơn)
// const adminUpdateProfileSchema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(30).optional(),
//   first_name: Joi.string().max(50).allow("", null).optional(),
//   last_name: Joi.string().max(50).allow("", null).optional(),
//   avatar_url: Joi.string().uri().allow("", null).optional().messages({
//     "string.uri": "URL ảnh đại diện không hợp lệ",
//   }),
//   role: Joi.string().valid("user", "admin").optional().messages({
//     "any.only": 'Quyền chỉ có thể là "user" hoặc "admin".',
//   }),
//   is_enabled: Joi.boolean().optional(), // Cho phép admin cập nhật is_enabled
//   email_verified: Joi.boolean().optional(), // Cho phép admin cập nhật email_verified
// })
//   .min(1)
//   .messages({
//     "object.min": "Cần cung cấp ít nhất một trường thông tin để cập nhật.",
//   });

// const changePasswordSchema = Joi.object({
//   old_password: Joi.string().required().messages({
//     "any.required": "Mật khẩu cũ là bắt buộc",
//   }),
//   new_password: Joi.string().min(6).required().messages({
//     "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
//     "any.required": "Mật khẩu mới là bắt buộc",
//   }),
// });

// const forgotPasswordSchema = Joi.object({
//   email: Joi.string().email().required().messages({
//     "string.email": "Email không hợp lệ",
//     "any.required": "Email là bắt buộc",
//   }),
// });

// const resetPasswordSchema = Joi.object({
//   password: Joi.string().min(6).required().messages({
//     "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
//     "any.required": "Mật khẩu mới là bắt buộc",
//   }),
// });

// // Validate route parameter :userId
// const userIdParamSchema = Joi.object({
//   userId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
//     // Specify UUID version if needed
//     "string.guid": "ID người dùng không phải là UUID hợp lệ",
//     "any.required": "ID người dùng trong URL là bắt buộc",
//   }),
// });

// // Validate route parameter
// const tokenParamSchema = Joi.object({
//   token: Joi.string().hex().length(64).required().messages({
//     "string.hex": "Token phải là chuỗi hex",
//     "string.length": "Token phải có độ dài là {#limit} ký tự",
//     "any.required": "Token trong URL là bắt buộc",
//   }),
// });

// const resendVerificationSchema = Joi.object({
//   email: Joi.string().email().required().messages({
//     "string.email": "Email không hợp lệ.",
//     "string.empty": "Email không được để trống.",
//     "any.required": "Email là trường bắt buộc.",
//   }),
// });

// // --- Middleware Exports ---
// export const validateRegister = validate(registerSchema, "body");
// export const validateLogin = validate(loginSchema, "body");
// export const validateUpdateProfile = validate(updateProfileSchema, "body");
// export const validateAdminUpdateProfile = validate(
//   adminUpdateProfileSchema,
//   "body"
// );
// export const validateChangePassword = validate(changePasswordSchema, "body");
// export const validateForgotPassword = validate(forgotPasswordSchema, "body");
// export const validateResetPassword = validate(resetPasswordSchema, "body");
// export const validateUserIdParam = validate(userIdParamSchema, "params");
// export const validateTokenParam = validate(tokenParamSchema, "params");
// export const validateResendVerification = validate(
//   resendVerificationSchema,
//   "body"
// );

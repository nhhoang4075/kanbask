import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error.js";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }));
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Dữ liệu không hợp lệ.", errorMessages));
    } else {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lỗi validation không xác định."));
    }
  }
};

const updateProfileSchema = z.object({
  body: z
    .object({
      first_name: z.string().max(100).nullable().optional(),
      last_name: z.string().max(100).nullable().optional(),
      avatar_url: z.string().url("URL ảnh đại diện không hợp lệ.").nullable().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần cung cấp ít nhất một trường thông tin để cập nhật."
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const adminUpdateProfileSchema = z.object({
  body: z
    .object({
      first_name: z.string().max(100).nullable().optional(),
      last_name: z.string().max(100).nullable().optional(),
      avatar_url: z.string().url("URL ảnh đại diện không hợp lệ.").nullable().optional(),
      role: z
        .enum(["user", "admin"], { errorMap: () => ({ message: "Quyền không hợp lệ." }) })
        .optional(),
      is_enabled: z
        .boolean({ errorMap: () => ({ message: "Trạng thái kích hoạt phải là true/false." }) })
        .optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Cần cung cấp ít nhất một trường thông tin để cập nhật."
    }),
  params: z.object({
    userId: z.string().uuid({ message: "ID người dùng trong URL không hợp lệ." })
  }),
  query: z.object({}).optional()
});

const changePasswordSchema = z.object({
  body: z.object({
    old_password: z.string({ required_error: "Mật khẩu cũ là bắt buộc." }).min(1),
    new_password: z
      .string({ required_error: "Mật khẩu mới là bắt buộc." })
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid({ message: "ID người dùng trong URL không hợp lệ." })
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional()
});

const findUserByEmailSchema = z.object({
  query: z.object({
    email: z
      .string({ required_error: 'Cần cung cấp query parameter "email".' })
      .email('Query parameter "email" không đúng định dạng.')
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional()
});

export const validateUpdateProfile = validate(updateProfileSchema);
export const validateAdminUpdateProfile = validate(adminUpdateProfileSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateUserIdParam = validate(userIdParamSchema);
export const validateFindUserByEmail = validate(findUserByEmailSchema);

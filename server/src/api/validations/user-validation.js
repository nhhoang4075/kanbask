import { z } from "zod";

import { validate } from "../../utils/helper.js";

const validateUpdateProfile = validate(
  z.object({
    body: z
      .object({
        first_name: z.string().max(100).optional(),
        last_name: z.string().max(100).optional(),
        avatar_url: z.string().url().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateChangePassword = validate(
  z.object({
    body: z
      .object({
        old_password: z.string().min(8).max(255),
        new_password: z.string().min(8).max(255)
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUserIdParam = validate(
  z.object({
    params: z
      .object({
        user_id: z.string().uuid()
      })
      .strict(),
    body: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUserEmailQuery = validate(
  z.object({
    query: z
      .object({
        email: z.string().email()
      })
      .strict(),
    body: z.object({}).optional(),
    params: z.object({}).optional()
  })
);

const validateUpdateUserForAdmin = validate(
  z.object({
    body: z
      .object({
        role: z.enum(["user", "admin"]).optional(),
        is_enabled: z.boolean().optional()
      })
      .strict(),
    params: z
      .object({
        user_id: z.string().uuid()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateUpdateProfile,
  validateChangePassword,
  validateUserIdParam,
  validateUserEmailQuery,
  validateUpdateUserForAdmin
};

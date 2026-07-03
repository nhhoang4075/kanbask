import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateUpdateProfile = validate(
  z.object({
    body: z
      .object({
        full_name: z.string().max(100).optional(),
        first_name: z.string().max(100).optional(),
        last_name: z.string().max(100).optional(),
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

export default {
  validateUpdateProfile,
  validateChangePassword,
};

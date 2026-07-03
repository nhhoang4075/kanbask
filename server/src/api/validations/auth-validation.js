import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateRegister = validate(
  z.object({
    body: z
      .object({
        email: z.string().email().max(100),
        password: z.string().min(8).max(255),
        full_name: z.string().min(1).max(100)
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateLogin = validate(
  z.object({
    body: z
      .object({
        email: z.string().email().max(100),
        password: z.string().min(8).max(255),
        remember: z.boolean()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateEmailQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z
      .object({
        email: z.string().email().max(100)
      })
      .strict()
  })
);

const validateVerificationCodeQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z.object({ code: z.string().length(6) }).strict()
  })
);

const validatePasswordReset = validate(
  z.object({
    body: z
      .object({
        code: z.string(),
        new_password: z.string().min(8).max(255)
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

export default {
  validateRegister,
  validateLogin,
  validateEmailQuery,
  validateVerificationCodeQuery,
  validatePasswordReset
};

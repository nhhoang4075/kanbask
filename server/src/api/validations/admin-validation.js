import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateListQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z
      .object({
        q: z.string().optional(),
        limit: z.coerce.number().int().positive().max(100).optional(),
        offset: z.coerce.number().int().min(0).optional()
      })
      .strict()
  })
);

const validateUserIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({ id: z.string().uuid() }).strict(),
    query: z.object({}).optional()
  })
);

const validateUpdateUserRole = validate(
  z.object({
    body: z.object({ role: z.enum(["user", "admin"]) }).strict(),
    params: z.object({ id: z.string().uuid() }).strict(),
    query: z.object({}).optional()
  })
);

const validateSetUserEnabled = validate(
  z.object({
    body: z.object({ is_enabled: z.boolean() }).strict(),
    params: z.object({ id: z.string().uuid() }).strict(),
    query: z.object({}).optional()
  })
);

const validateTeamIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({ id: z.coerce.number().int().positive() }).strict(),
    query: z.object({}).optional()
  })
);

const validateProjectIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({ id: z.coerce.number().int().positive() }).strict(),
    query: z.object({}).optional()
  })
);

const validateTransferTeamOwnership = validate(
  z.object({
    body: z.object({ user_id: z.string().uuid() }).strict(),
    params: z.object({ id: z.coerce.number().int().positive() }).strict(),
    query: z.object({}).optional()
  })
);

const validateTransferProjectOwnership = validate(
  z.object({
    body: z.object({ user_id: z.string().uuid() }).strict(),
    params: z.object({ id: z.coerce.number().int().positive() }).strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateListQuery,
  validateUserIdParam,
  validateUpdateUserRole,
  validateSetUserEnabled,
  validateTeamIdParam,
  validateProjectIdParam,
  validateTransferTeamOwnership,
  validateTransferProjectOwnership
};

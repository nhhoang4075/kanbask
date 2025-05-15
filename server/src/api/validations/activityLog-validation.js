import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateCreateActivityLog = validate(
  z.object({
    body: z
      .object({
        user_id: z.string().uuid(),
        action: z.string().max(100),
        description: z.string().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateActivityLogIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    params: z
      .object({
        id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateCreateActivityLog,
  validateActivityLogIdParam
};

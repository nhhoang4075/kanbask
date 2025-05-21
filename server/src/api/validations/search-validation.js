import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateSearchUsersQuery = validate(
  z.object({
    query: z
      .object({
        q: z.string().max(255).optional(),
        limit: z.coerce.number().int().positive().optional(),
        offset: z.coerce.number().int().nonnegative().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    body: z.object({}).optional()
  })
);

const validateSearchTasksQuery = validate(
  z.object({
    query: z
      .object({
        q: z.string().max(255).optional(),
        status: z.enum(["todo", "in_progress", "review", "done", "canceled", "all"]).optional(),
        limit: z.coerce.number().int().positive().optional(),
        offset: z.coerce.number().int().nonnegative().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    body: z.object({}).optional()
  })
);

const validateSearchMessagesQuery = validate(
  z.object({
    query: z
      .object({
        q: z.string().max(255).optional(),
        conversation_id: z.coerce.number().int().positive(),
        limit: z.coerce.number().int().positive().optional(),
        offset: z.coerce.number().int().nonnegative().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    body: z.object({}).optional()
  })
);

export default {
  validateSearchUsersQuery,
  validateSearchTasksQuery,
  validateSearchMessagesQuery
};

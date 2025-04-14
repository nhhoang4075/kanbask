import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateNewConversation = validate(
  z.object({
    body: z
      .object({
        type: z.enum(["direct", "team", "project"]),
        team_id: z.number().int().optional(),
        project_id: z.number().int().optional(),
        user_ids: z.array(z.string().uuid()).min(2)
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUserId = validate(
  z.object({
    body: z
      .object({
        user_id: z.string().uuid()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateConversationIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    params: z
      .object({
        id: z.coerce.number().int()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateNewConversation,
  validateUserId,
  validateConversationIdParam
};

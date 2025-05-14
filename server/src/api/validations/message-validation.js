import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateConversationIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    query: z.object({}).optional(),
    params: z
      .object({
        conversation_id: z.coerce.number().int().positive()
      })
      .strict()
  })
);

export default {
  validateConversationIdParam
};

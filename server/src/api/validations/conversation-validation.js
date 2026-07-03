import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateConversationIdParam = validate(
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
  validateConversationIdParam
};

import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateConversationIdQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).strict(),
    query: z.object({ conversation_id: z.coerce.number().int().positive() }).optional()
  })
);

export default {
  validateConversationIdQuery
};

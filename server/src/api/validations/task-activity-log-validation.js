import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateTaskIdQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).strict(),
    query: z.object({ task_id: z.coerce.number().int().positive() }).optional()
  })
);

const validateProjectIdQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).strict(),
    query: z.object({ project_id: z.coerce.number().int().positive() }).optional()
  })
);

export default {
  validateTaskIdQuery,
  validateProjectIdQuery
};

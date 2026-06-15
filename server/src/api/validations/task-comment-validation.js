import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateCreateTaskComment = validate(
  z.object({
    body: z
      .object({
        task_id: z.coerce.number().int().positive(),
        content: z.string()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUpdateTaskComment = validate(
  z.object({
    body: z
      .object({
        content: z.string().optional()
      })
      .strict(),
    params: z
      .object({
        id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

const validateTaskCommentIdParam = validate(
  z.object({
    body: z.object({}).strict(),
    params: z
      .object({
        id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

const validateTaskIdQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).strict(),
    query: z.object({ task_id: z.coerce.number().int().positive() }).optional()
  })
);

export default {
  validateCreateTaskComment,
  validateUpdateTaskComment,
  validateTaskCommentIdParam,
  validateTaskIdQuery
};

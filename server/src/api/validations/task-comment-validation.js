import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateCreateComment = validate(
  z.object({
    body: z.object({
      task_id: z.coerce.number().int().positive(),
      user_id: z.string().uuid(),
      content: z.string().max(5000)
    }).strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateGetCommentsByTaskId = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({
      taskId: z.coerce.number().int().positive()
    }).strict(),
    query: z.object({}).optional()
  })
);

const validateUpdateComment = validate(
  z.object({
    body: z.object({
      user_id: z.string().uuid(),
      content: z.string().max(5000)
    }).strict(),
    params: z.object({
      id: z.coerce.number().int().positive()
    }).strict(),
    query: z.object({}).optional()
  })
);

const validateDeleteComment = validate(
  z.object({
    body : z.object({
      user_id: z.string().uuid()
    }).strict(),
    params: z.object({
      id: z.coerce.number().int().positive()
    }).strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateCreateComment,
  validateGetCommentsByTaskId,
  validateUpdateComment,
  validateDeleteComment
};

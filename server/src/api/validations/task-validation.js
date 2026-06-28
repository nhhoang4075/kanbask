import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateCreateTask = validate(
  z.object({
    body: z
      .object({
        project_id: z.coerce.number().int().positive(),
        title: z.string().max(255),
        description: z.string().max(1000).optional(),
        status: z.enum(["todo", "in_progress", "done", "review", "canceled"]).nullable().optional(),
        priority: z.enum(["low", "medium", "high"]).nullable().optional(),
        due_date: z.coerce.date().optional(),
        completed_at: z.coerce.date().optional(),
        assignees: z.array(z.string().uuid()).optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUpdateTask = validate(
  z.object({
    body: z
      .object({
        title: z.string().max(255).optional(),
        description: z.string().max(1000).optional(),
        status: z.enum(["todo", "in_progress", "done", "review", "canceled"]).nullable().optional(),
        priority: z.enum(["low", "medium", "high"]).nullable().optional(),
        due_date: z.coerce.date().optional(),
        completed_at: z.coerce.date().optional(),
        position: z.coerce.number().int().positive().optional(),
        assignees: z.array(z.string().uuid()).optional()
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

const validateGetTaskAttachmentUrl = validate(
  z.object({
    body: z.object({}).optional(),
    params: z
      .object({
        id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({ attachment_id: z.string().uuid() }).optional()
  })
);

const validateDeleteTaskAttachments = validate(
  z.object({
    body: z.object({ attachment_ids: z.array(z.string().uuid()) }).optional(),
    params: z
      .object({
        id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

const validateTaskIdParam = validate(
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

const validateProjectIdQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z
      .object({
        project_id: z.coerce.number().int().positive()
      })
      .strict()
  })
);

export default {
  validateCreateTask,
  validateUpdateTask,
  validateGetTaskAttachmentUrl,
  validateDeleteTaskAttachments,
  validateTaskIdParam,
  validateProjectIdQuery
};

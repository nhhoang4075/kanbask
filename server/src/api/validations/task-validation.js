import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateCreateTask = validate(
  z.object({
    body: z
      .object({
        project_id: z.coerce.number().int().positive(),
        title: z.string().max(255).optional(),
        status: z.enum(["todo", "in_progress", "done", "review", "canceled"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        due_date: z.string().optional(),
        assignees: z.array(z.string().uuid()).optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateGetProjectTasks = validate(
  z.object({
    body: z
      .object({
        project_id: z.coerce.number().int().positive()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateGetTaskById = validate(
  z.object({
    body: z.object({}).optional(),
    params: z
      .object({
        task_id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

const validateUpdateTask = validate(
  z.object({
    body: z
      .object({
        title: z.string().max(255).optional(),
        status: z.enum(["todo", "in_progress", "done", "review", "canceled"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        due_date: z.string().optional(),
        position: z.coerce.number().int().positive().optional(),
        assignees: z.array(z.string().uuid()).optional()
      })
      .strict(),
    params: z
      .object({
        task_id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

const validateDeleteTask = validate(
  z.object({
    body: z.object({}).optional(),
    params: z
      .object({
        task_id: z.coerce.number().int().positive()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateCreateTask,
  validateGetProjectTasks,
  validateGetTaskById,
  validateUpdateTask,
  validateDeleteTask
};

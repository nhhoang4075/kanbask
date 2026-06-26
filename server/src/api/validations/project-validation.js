import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateCreateProject = validate(
  z.object({
    body: z
      .object({
        team_id: z.coerce.number().int().positive(),
        name: z.string().min(1).max(100),
        description: z.string().max(1000).optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUpdateProject = validate(
  z.object({
    body: z
      .object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(1000).optional()
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

const validateUpdateProjectMembers = validate(
  z.object({
    body: z
      .object({
        user_ids: z.array(z.string().uuid())
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

const validateUpdateProjectRole = validate(
  z.object({
    body: z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["member", "admin"])
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

const validateProjectIdParam = validate(
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

const validateTeamIdQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).strict(),
    query: z
      .object({
        team_id: z.coerce.number().int().positive()
      })
      .strict()
  })
);

export default {
  validateCreateProject,
  validateUpdateProject,
  validateUpdateProjectMembers,
  validateUpdateProjectRole,
  validateProjectIdParam,
  validateTeamIdQuery
};

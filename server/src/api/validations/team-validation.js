import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateCreateTeam = validate(
  z.object({
    body: z
      .object({
        name: z.string().min(1).max(100),
        description: z.string().max(1000).optional(),
        join_policy: z.enum(["auto", "manual"])
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUpdateTeam = validate(
  z.object({
    body: z
      .object({
        name: z.string().max(100).optional(),
        description: z.string().max(1000).optional(),
        join_policy: z.enum(["auto", "manual"]).optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUpdateTeamMembers = validate(
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

const validateUpdateTeamRole = validate(
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

const validateTeamIdParam = validate(
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

const validateTeamJoinRequestIdParam = validate(
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

const validateTeamCodeQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).strict(),
    query: z.object({ code: z.string().length(8) }).strict()
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
  validateCreateTeam,
  validateUpdateTeam,
  validateUpdateTeamMembers,
  validateUpdateTeamRole,
  validateTeamIdParam,
  validateTeamJoinRequestIdParam,
  validateTeamCodeQuery,
  validateTeamIdQuery
};

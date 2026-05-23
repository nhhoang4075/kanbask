import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateCreateTeam = validate(
  z.object({
    body: z
      .object({
        name: z.string().max(100),
        description: z.string().max(255).optional(),
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
        description: z.string().max(255).optional(),
        join_policy: z.enum(["auto", "manual"]).optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

// const validateAddMembers = validate(
//   z.object({
//     body: z
//       .object({
//         teamId: z.coerce.number(),
//         userIds: z.array(z.string().uuid())
//       })
//       .strict(),
//     params: z
//       .object({
//         teamId: z.coerce.number()
//       })
//       .strict(),
//     query: z.object({}).optional()
//   })
// );

const validateDeleteMembers = validate(
  z.object({
    body: z
      .object({
        user_ids: z.array(z.string().uuid())
      })
      .strict(),
    params: z
      .object({
        id: z.coerce.number()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

const validateUpdateRole = validate(
  z.object({
    body: z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["member", "admin"])
      })
      .strict(),
    params: z
      .object({
        team_id: z.coerce.number()
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
        id: z.coerce.number().int()
      })
      .strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateCreateTeam,
  validateUpdateTeam,
  validateDeleteMembers,
  validateUpdateRole,
  validateTeamIdParam
};

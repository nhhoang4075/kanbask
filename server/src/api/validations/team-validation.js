import { z } from "zod";

import { validate } from "../../config/validator.js";


const validateCreateTeam = validate(
  z.object({
    body: z
      .object({
        name: z.string().max(100),
        code: z.string().max(10),
        description: z.string().max(255).optional(),
        userId: z.string().uuid()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);


const validateAddMembers = validate(
  z.object({
    body: z
      .object({
        teamId: z.coerce.number(),
        userIds: z.array(z.string().uuid())
      })
      .strict(),
      params: z
      .object({
        teamId: z.coerce.number()
      })
      .strict(),
    query: z.object({}).optional()
  })
);


const validateDeleteMembers = validate(
  z.object({
    body: z
      .object({
        teamId: z.coerce.number(),
        userIds: z.array(z.string().uuid()),
        deleterId: z.string().uuid()
      })
      .strict(),
    params: z
      .object({
        teamId: z.coerce.number()
      })
      .strict(),
    query: z.object({}).optional()
  })
);


const validateDeleteTeam = validate(
    z.object({
      body: z
        .object({
          teamId: z.coerce.number(),
          deleterId: z.string().uuid()
        })
        .strict(),
        params: z
        .object({
          teamId: z.coerce.number()
        })
        .strict(),
      query: z.object({}).optional()
    })
  );


  const validateAddAdmin = validate(
    z.object({
      body: z
        .object({
          teamId: z.coerce.number(),
          userIds: z.array(z.string().uuid()),
          adderId: z.string().uuid()
        })
        .strict(),
      params: z
        .object({
          teamId: z.coerce.number()
        })
        .strict(),
      query: z.object({}).optional()
    })
  );        
 
export default {
    validateCreateTeam,
    validateAddMembers,
    validateDeleteMembers,
    validateDeleteTeam,
    validateAddAdmin
  };

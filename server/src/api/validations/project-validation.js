import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateCreateProject = validate(
  z.object({
    body: z
      .object({
        team_id: z.string().uuid(),
        name: z.string().min(1).max(100),
        description: z.string().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateProjectMemberParams = validate(
  z.object({
    params: z
      .object({
        project_id: z.string().uuid(),
        user_id: z.string().uuid()
      })
      .strict(),
    body: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateUpdateUserProjectRole = validate(
  z.object({
    params: z
      .object({
        project_id: z.string().uuid(),
        user_id: z.string().uuid()
      })
      .strict(),
    body: z
      .object({
        role: z.enum(["member", "admin", "owner"])
      })
      .strict(),
    query: z.object({}).optional()
  })
);

export default {
  validateCreateProject,
  validateProjectMemberParams,
  validateUpdateUserProjectRole
};

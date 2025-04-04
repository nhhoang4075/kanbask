import { z } from "zod";

import { handleValidationError } from "../../utils/helpers.js";

const validateNewConversation = async (req, res, next) => {
  try {
    const schema = z.object({
      type: z.enum(["direct", "team", "project"]),
      team_id: z.number().int().optional(),
      project_id: z.number().int().optional(),
      user_ids: z.array(z.string().uuid()).min(2)
    });

    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const validateUserIdParam = async (req, res, next) => {
  try {
    const schema = z.object({
      user_id: z.string().uuid()
    });

    await schema.parseAsync(req.params);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const validateConversationIdParam = async (req, res, next) => {
  try {
    const schema = z.object({
      id: z.coerce.number().int()
    });

    await schema.parseAsync(req.params);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  validateNewConversation,
  validateUserIdParam,
  validateConversationIdParam
};

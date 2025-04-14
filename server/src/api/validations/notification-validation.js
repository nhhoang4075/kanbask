import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateGetNotifications = validate(
  z.object({
    query: z.object({
        limit: z.coerce.number().int().positive().optional(),
        offset: z.coerce.number().int().nonnegative().optional(),
        unread: z.enum(['true', 'false']).optional()
    }).strict(),
    params: z.object({}).optional(),
    body: z.object({}).optional(),
  })
);

const validateNotificationIdParam = validate(
  z.object({
    params: z.object({
        id: z.coerce.number().int().positive()
    }).strict(),
    query: z.object({}).optional(),
    body: z.object({}).optional(),
  })
);

const validateCreateNotification = validate(
  z.object({
    body: z.object({
      user_id: z.string().uuid("Invalid user ID format"),
      content: z.string().min(1, "Content cannot be empty").max(500, "Content too long"),
      type: z.string().min(1, "Type cannot be empty").max(50, "Type too long"),
      reference_id: z.coerce.number().int().positive().optional(),
    }).strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
  })
);

export default {
    validateGetNotifications,
    validateNotificationIdParam,
    validateCreateNotification,
};
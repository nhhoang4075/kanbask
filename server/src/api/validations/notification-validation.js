import { z } from "zod";

import { validate } from "../../config/validator.js";

const validateNewNotification = validate(
  z.object({
    body: z
      .object({
        user_id: z.string().uuid(),
        content: z.string().min(1),
        type: z.string().min(1).max(50),
        reference_id: z.coerce.number().int().positive().optional()
      })
      .strict(),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
);

const validateNotificationsOptionsQuery = validate(
  z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z
      .object({
        limit: z.coerce.number().int().positive().optional(),
        offset: z.coerce.number().int().nonnegative().optional(),
        unread: z.enum(["true", "false"]).optional()
      })
      .strict()
  })
);

const validateNotificationIdParam = validate(
  z.object({
    body: z.object({}).optional(),
    query: z.object({}).optional(),
    params: z
      .object({
        id: z.coerce.number().int().positive()
      })
      .strict()
  })
);

export default {
  validateNewNotification,
  validateNotificationsOptionsQuery,
  validateNotificationIdParam
};

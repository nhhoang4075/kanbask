import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateAttachmentIdParam = validate(
  z
    .object({
      params: z
        .object({
          attachment_id: z.string().uuid()
        })
        .strict(),
      body: z.object({}).optional(),
      query: z.object({}).optional()
    })
    .strict()
);

const validateParentIdParam = (paramName = "id") =>
  validate(
    z
      .object({
        params: z
          .object({
            [paramName]: z.string()
          })
          .strict()
          .refine(
            (actualParams) => {
              const idValue = actualParams[paramName];
              return idValue && /^\d+$/.test(idValue) && parseInt(idValue, 10) > 0;
            },
            {
              message: `Parameter '${paramName}' must be a positive integer.`,
              path: [paramName]
            }
          ),
        body: z.object({}).optional(),
        query: z.object({}).optional()
      })
      .strict()
  );

export default {
  validateAttachmentIdParam,
  validateParentIdParam
};

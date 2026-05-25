import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateIdParam = validate(
  z.object({
    params: z
      .object({
        id: z.string().uuid()
      })
      .strict(),
    query: z.object({}).optional(),
    body: z.object({}).optional()
  })
);

export default {
  validateIdParam
};

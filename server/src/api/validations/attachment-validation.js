import { z } from "zod";
import { validate } from "../../config/validator.js";

const validateAttachmentIdParam = validate(
  z.object({
    params: z.object({
      attachmentId: z.string().uuid("Invalid Attachment ID format (UUID expected).")
    }).strict(),
    body: z.object({}).optional(),
    query: z.object({}).optional(),
  }).strict()
);

const validateParentIdParam = (paramName = "id") => validate(
  z.object({
    params: z.object({
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
    query: z.object({}).optional(),
  }).strict()
);

const validateLinkBody = validate(
  z.object({
    body: z.object({
      attachmentId: z.string().uuid("Field 'attachmentId' in body must be a valid UUID.")
    }).strict(),
    params: z.any().optional(),
    query: z.object({}).optional(),
  }).strict()
);

const validateUnlinkParams = (parentParamName = "id") => validate(
  z.object({
    params: z.object({
      [parentParamName]: z.string(),
      attachmentId: z.string().uuid("Parameter 'attachmentId' must be a valid UUID.")
    })
    .strict()
    .refine(
      (actualParams) => {
        const parentIdValue = actualParams[parentParamName];
        return parentIdValue && /^\d+$/.test(parentIdValue) && parseInt(parentIdValue, 10) > 0;
      },
      {
        message: `Parameter '${parentParamName}' must be a positive integer.`,
        path: [parentParamName]
      }
    ),
    body: z.object({}).optional(),
    query: z.object({}).optional(),
  }).strict()
);

export default {
  validateAttachmentIdParam,
  validateParentIdParam,
  validateLinkBody,
  validateUnlinkParams
};

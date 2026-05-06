import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import ApiError from "./api-error.js";

/**
 * Handles validation errors by generating an appropriate `ApiError`.
 *
 * This function checks if the provided error is an instance of `ZodError`.
 * If it is, it maps through the error issues to create a detailed error message
 * indicating which fields are problematic. If the error is not a `ZodError`,
 * a generic internal server error message is returned.
 *
 * @param {any} error - The error object that needs to be handled. This can
 * be an instance of ZodError or any other error type.
 * @returns {ApiError} An instance of `ApiError` containing the appropriate
 * status code and error message.
 */
export const handleValidationError = (error) => {
  if (error instanceof ZodError) {
    const errorMessages = error.errors
      .map((issue) =>
        issue.path.length
          ? `'${issue.path.join(".")}' is ${issue.message}`
          : "All required data is empty"
      )
      .join(". ");

    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
  } else {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query });

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors
        .map((issue) =>
          issue.path.length
            ? `'${issue.path.join(".")}' is ${issue.message}`
            : "All required data is empty"
        )
        .join(". ");

      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages));
    } else {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
  }
};

/**
 * Filters an object to only include allowed fields.
 *
 * Supports passing allowed fields either as an array or as multiple arguments.
 *
 * @param {object} data - The original object to sanitize.
 * @param {...string|string[]} fields - The allowed fields (can be a list or a single array).
 * @returns {object} A new object containing only the allowed fields.
 */
export const sanitizeAllowedFields = (obj, ...fields) => {
  const allowedFields = Array.isArray(fields[0]) ? fields[0] : fields;
  const sanitized = {};

  for (const key of allowedFields) {
    if (key in obj) {
      sanitized[key] = obj[key];
    }
  }

  return sanitized;
};

export const sanitizeUser = (user) => {
  if (!user) return null;

  const sanitized = { ...user };

  // Remove sensitive fields
  delete sanitized.password_hash;
  delete sanitized.verification_code;
  delete sanitized.verification_expires;
  delete sanitized.password_reset_code;
  delete sanitized.password_reset_expires;

  return sanitized;
};

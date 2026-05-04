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

export const sanitizeUser = (user) => {
  if (!user) return null;

  const sanitizedUser = { ...user };

  // Remove sensitive fields
  delete sanitizedUser.password_hash;
  delete sanitizedUser.verification_code;
  delete sanitizedUser.verification_expires;
  delete sanitizedUser.password_reset_code;
  delete sanitizedUser.password_reset_expires;

  return sanitizedUser;
};

export const sanitizeUserList = (userList) => {
  if (!userList || !Array.isArray(userList)) return null;

  return userList.map((user) => sanitizeUser(user));
};

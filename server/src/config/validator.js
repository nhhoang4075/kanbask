import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import ApiError from "../utils/api-error.js";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query });

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors
        .map((issue) =>
          issue.path.length
            ? `req.${issue.path.join(".")}: ${issue.message}`
            : "All required data is empty"
        )
        .join("; ");

      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages));
    } else {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
  }
};

export { validate };

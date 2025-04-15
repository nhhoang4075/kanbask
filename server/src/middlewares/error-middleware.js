import ApiError from "../utils/api-error.js";

const handleApiError = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    err = new ApiError(500, "Internal Server Error");
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};

export { handleApiError };

import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { appLogger } from "../loggers/logger.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode =
      error.status || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);

    const response = {
      ...error,
      message: error.message,
      ...(process.env.__DEV__ ? { stack: error.stack } : {})
    };
    appLogger.error(
      `Error: ${error.message}, Status Code: ${error.statusCode}, Stack: ${error.stack}`
    );
    return res.statusCode(error.statusCode).json(response);
  }
};

export { errorHandler };

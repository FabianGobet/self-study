import { appLogger } from "../loggers/logger.js";

/**
 * A higher-order function to handle asynchronous route handlers and middleware.
 * It ensures that any errors thrown in the asynchronous code are caught and passed
 * to the next middleware in the Express error-handling chain.
 *
 * @param {Function} requestHandler - The asynchronous route handler or middleware function.
 * @returns {Function} A wrapper function that handles errors and passes them to `next`.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      appLogger.error(
        `Error: ${err.message}, Status Code: ${err.statusCode}, Stack: ${err.stack}`
      );
      next(err);
    });
  };
};

export { asyncHandler };

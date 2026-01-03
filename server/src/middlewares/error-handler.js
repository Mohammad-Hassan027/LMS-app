import { ApiError } from '../utils/ApiError.js';

export const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Check if the error is an instance of your custom ApiError
  if (!(error instanceof ApiError)) {
    // If not (e.g., Mongoose validation error, syntax error), wrap it
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';

    // Create a new ApiError instance to keep responses consistent
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  // 2. Prepare the response object
  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    // Only show stack trace in development mode for security
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  // 3. Send the response
  return res.status(error.statusCode).json(response);
};

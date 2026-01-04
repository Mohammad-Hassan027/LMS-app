import { ApiError } from '../utils/ApiError.js';

export const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Handle Mongoose "CastError" (Invalid ID format)
  if (error.name === 'CastError') {
    const message = `Invalid resource found: ${error.path}`;
    error = new ApiError(400, message);
  }

  // 2. Handle Mongoose Duplicate Key Error
  if (error.code === 11000) {
    // Extract the field name that caused the duplicate error
    const field = Object.keys(error.keyValue)[0];
    const message = `Duplicate field value entered for ${field}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // 3. Handle Mongoose Validation Error
  if (error.name === 'ValidationError') {
    // Combine all validation error messages into one string
    const message = Object.values(error.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(400, message);
  }

  // 4. Fallback: If it's not an ApiError yet, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    // Show stack trace only in development
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

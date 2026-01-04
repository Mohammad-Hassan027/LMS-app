import { ApiError } from './ApiError.js';

export const validateId = (id, fieldName = 'ID') => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, `Invalid ${fieldName} format`);
  }
  return id;
};

import { getAuth, clerkClient } from '@clerk/express';
import { ApiError } from '../utils/ApiError.js';

export const requireRole = (requiredRole = []) => {
  return async (req, res, next) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        throw new ApiError(401, 'Unauthorized: User not authenticated');
      }

      // Fetch the user's data from Clerk's backend API
      const user = await clerkClient.users.getUser(userId);

      const rawRoles = user.publicMetadata?.role;

      const userRoles = Array.isArray(rawRoles)
        ? rawRoles
        : typeof rawRoles === 'string'
          ? [rawRoles]
          : [];

      const hasPermission = requiredRole.some((role) =>
        userRoles.includes(role)
      );

      if (!hasPermission) {
        throw new ApiError(
          403,
          `Forbidden: Access requires ${requiredRole} role`
        );
      }

      next();
    } catch (error) {
      console.error('Role verification failed:', error);
      throw new ApiError(
        500,
        'Internal server error during authorization',
        error.message,
        error.stack
      );
    }
  };
};

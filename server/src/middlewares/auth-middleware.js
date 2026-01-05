import { getAuth, clerkClient } from '@clerk/express';

export const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      // Fetch the user's data from Clerk's backend API
      const user = await clerkClient.users.getUser(userId);

      const userRole = user.publicMetadata?.role;

      if (userRole !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: Access requires ${requiredRole} role`,
        });
      }

      next();
    } catch (error) {
      console.error('Role verification failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authorization',
      });
    }
  };
};

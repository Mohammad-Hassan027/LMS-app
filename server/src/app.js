import express from 'express';
import { clerkClient, getAuth, requireAuth } from '@clerk/express';
import { middleware } from './middlewares/global-middlewares.js';
import {
  globalRateLimiter,
  paymentRateLimiter,
} from './middlewares/rate-limter.js';
import { globalErrorHandler } from './middlewares/error-handler.js';

const app = express();

middleware(app);
app.set('trust proxy', 1);
app.use(globalRateLimiter);

import { requireRole } from './middlewares/auth-middleware.js';
import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js';
import studentViewCourseRoutes from './routes/student-routes/course-routes.js';
import studentViewOrderRoutes from './routes/student-routes/order-routes.js';
import studentViewMyCourseRoutes from './routes/student-routes/student-courses-routes.js';
import studentViewCourseProgressRoutes from './routes/student-routes/course-progress-routes.js';

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1/media', requireAuth(), mediaRoutes);
app.use(
  '/api/v1/instructor/course',
  requireAuth(),
  requireRole('instructor'),
  instructorCourseRoutes
);

// Public Routes
app.use('/api/v1/student/course', studentViewCourseRoutes);

// Protected Student Routes
app.use(
  '/api/v1/student/order',
  // requireAuth(),
  paymentRateLimiter,
  studentViewOrderRoutes
);
app.use('/api/v1/student/my-courses', requireAuth(), studentViewMyCourseRoutes);
app.use(
  '/api/v1/student/course-progress',
  requireAuth(),
  studentViewCourseProgressRoutes
);

// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get('/api/v1/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req);

  // Use Clerk's JS Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);

  return res.json({ user });
});

app.use(globalErrorHandler);

export { app };
export default app;

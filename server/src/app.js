import express from 'express';
import { requireAuth, getAuth, clerkClient } from '@clerk/express';
import { middleware } from './middlewares/middleware.js';
const app = express();

middleware(app);

import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js';
import studentCourseRoutes from './routes/student-routes/course-routes.js';

app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1/media', requireAuth(), mediaRoutes);
app.use('/api/v1/instructor/course', requireAuth(), instructorCourseRoutes);
app.use('/api/v1/student/course', studentCourseRoutes);

// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get('/api/v1/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req);

  // Use Clerk's JS Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);

  return res.json({ user });
});

export { app };

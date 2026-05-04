import { Router } from 'express';
import {
  checkIsStudentEnrolled,
  getStudentViewAllCourses,
  getStudentViewCourseDetails,
} from '../../controllers/student-controller/course-controller.js';
import { requireAuth } from '@clerk/express';
const router = Router();

// Public Routes
router.get('/get', getStudentViewAllCourses);
router.get('/get/:courseId', getStudentViewCourseDetails);

// Private Route
router.get(
  '/check-is-enrolled/:userId/:courseId',
  requireAuth(),
  checkIsStudentEnrolled
);

export default router;

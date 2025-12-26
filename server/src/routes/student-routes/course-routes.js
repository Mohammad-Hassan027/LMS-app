import { Router } from 'express';
import {
  checkIsStudentEnrolled,
  getStudentViewAllCourses,
  getStudentViewCourseDetails,
} from '../../controllers/student-controller/course-controller.js';
const router = Router();

router.get('/get', getStudentViewAllCourses);
router.get('/get/:courseId', getStudentViewCourseDetails);
router.get('/check-is-enrolled/:studentId/:courseId', checkIsStudentEnrolled);

export default router;

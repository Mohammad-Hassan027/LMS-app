import { Router } from 'express';
import {
  getStudentViewAllCourses,
  getStudentViewCourseDetails,
} from '../../controllers/student-controller/course-controller.js';
const router = Router();

router.get('/get', getStudentViewAllCourses);
router.get('/get/:courseId', getStudentViewCourseDetails);

export default router;

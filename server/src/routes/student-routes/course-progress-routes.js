import { Router } from 'express';
import {
  getStudentCourseProgress,
  resetCurrentCourseProgress,
  markCurrentLectureAsViewed,
} from '../../controllers/student-controller/course-progress-controller.js';

const router = Router();

router.get('/get/:courseId/:userId', getStudentCourseProgress);
router.post('/mark-lecture-viewed', markCurrentLectureAsViewed);
router.post('/reset-progress', resetCurrentCourseProgress);

export default router;

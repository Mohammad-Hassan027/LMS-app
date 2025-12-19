import { Router } from 'express';
import {
  addNewCourse,
  deleteCourse,
  getAllCoursesByInstructorId,
  getCourseDetailsById,
  updateCourse,
} from '../../controllers/instructor-controller/course-controller.js';

const router = Router();

router.get('/get/details/:id', getCourseDetailsById);
router.get('/get/:id', getAllCoursesByInstructorId);
router.post('/add', addNewCourse);
router.put('/update/:id', updateCourse);
router.delete('/delete/:id', deleteCourse);

export default router;

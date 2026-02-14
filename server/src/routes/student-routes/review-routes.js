import { Router } from 'express';
import {
  createReview,
  getCourseReviews,
} from '../../controllers/student-controller/review-controller';

const router = Router();

router.get('/get/:courseId', getCourseReviews);
router.post('/add', createReview);

export default router;

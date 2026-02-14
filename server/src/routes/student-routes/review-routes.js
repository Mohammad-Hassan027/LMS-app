import { Router } from 'express';
import {
  createReview,
  getCourseReviews,
} from '../../controllers/student-controller/review-controller';

const router = Router();

router.get('/:courseId', getCourseReviews);
router.post('/', createReview);

export default router;

import { Router } from 'express';
import {
  createReview,
  getCourseReviews,
} from '../../controllers/student-controller/review-controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();

router.get('/:courseId', getCourseReviews);
router.post('/', requireAuth(), createReview);

export default router;

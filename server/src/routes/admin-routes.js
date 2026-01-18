import {
  getInstructorRequests,
  promoteToInstructor,
  rejectRequest,
  requestToBeInstructor,
} from '../controllers/admin-controller/index.js';
import { Router } from 'express';
import { requireRole } from '../middlewares/auth-middleware.js';

const router = Router();

// request
router.post('/request', requestToBeInstructor);

// get all
router.get('/requests', requireRole(['admin']), getInstructorRequests);

// approve
router.post('/approve', requireRole(['admin']), promoteToInstructor);

router.post('/reject', requireRole(['admin']), rejectRequest);

export default router;

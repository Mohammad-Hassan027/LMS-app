import {
  getActiveInstructors,
  getInstructorRequests,
  isInstructor,
  promoteToInstructor,
  rejectRequest,
  requestToBeInstructor,
  revokeInstructorRole,
  sendWarningToInstructor,
} from '../controllers/admin-controller/index.js';
import { Router } from 'express';
import { requireRole } from '../middlewares/auth-middleware.js';

const router = Router();

router.get('/active-instructors', getActiveInstructors);

// request
router.post('/request', requestToBeInstructor);

// get all
router.get('/requests', requireRole(['admin']), getInstructorRequests);

// approve
router.post('/approve', requireRole(['admin']), promoteToInstructor);

router.post('/reject', requireRole(['admin']), rejectRequest);

// Revoke Instructor Role
router.post('/revoke', requireRole(['admin']), revokeInstructorRole);

// Send Warning
router.post('/warn', requireRole(['admin']), sendWarningToInstructor);

router.get('/is-instructor/:userId', isInstructor);

export default router;

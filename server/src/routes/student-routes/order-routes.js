import { Router } from 'express';
import {
  createOrder,
  captureOrder,
} from '../../controllers/student-controller/order-controller.js';

const router = Router();

router.post('/create', createOrder);

// Updated: We now pass the PayPal Order ID in the URL
router.post('/capture/:orderID', captureOrder);

export default router;

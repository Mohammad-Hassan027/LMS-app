import { Router } from 'express';
import {
  createOrder,
  captureOrder,
} from '../../controllers/student-controller/order-controller.js';
import { handlePayPalWebhook } from '../../controllers/student-controller/paypal-webhook-controller.js';
import { requireAuth } from '@clerk/express';

const router = Router();

router.post('/create', requireAuth(), createOrder);

router.post('/capture/:paymentId', requireAuth(), captureOrder);

router.post('/webhook', handlePayPalWebhook);

export default router;

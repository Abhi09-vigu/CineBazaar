import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { createPaymentIntent } from '../controllers/paymentController.js';

const router = Router();

router.post('/intent', auth, [body('amount').isFloat({ min: 0.5 })], createPaymentIntent);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { createPaymentIntent, createRazorpayOrder, verifyRazorpay } from '../controllers/paymentController.js';

const router = Router();

router.post('/intent', auth, [body('amount').isFloat({ min: 0.5 })], createPaymentIntent);
router.post('/razorpay/order', auth, [body('amount').isFloat({ min: 0.5 })], createRazorpayOrder);
router.post('/razorpay/verify', auth, [
	body('razorpay_order_id').isString(),
	body('razorpay_payment_id').isString(),
	body('razorpay_signature').isString()
], verifyRazorpay);

export default router;

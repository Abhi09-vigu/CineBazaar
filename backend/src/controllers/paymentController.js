import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createPaymentIntent = async (req, res) => {
  // Mock payment: validate amount and return a fake clientSecret/paymentId
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  const id = `pi_mock_${Math.random().toString(36).slice(2, 10)}`;
  // In real Stripe: create PaymentIntent here
  res.status(201).json({ paymentId: id, clientSecret: `${id}_secret_mock` });
};

export const createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    return res.status(400).json({ message: 'Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
  }
  try {
    const instance = new Razorpay({ key_id, key_secret });
    const order = await instance.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    return res.status(201).json(order);
  } catch (e) {
    console.error('createRazorpayOrder error:', e?.message || e);
    return res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

export const verifyRazorpay = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) return res.status(400).json({ message: 'Razorpay not configured' });
  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', key_secret).update(body).digest('hex');
    const valid = expected === razorpay_signature;
    if (!valid) return res.status(400).json({ message: 'Invalid signature' });
    return res.json({ verified: true });
  } catch (e) {
    return res.status(500).json({ message: 'Verification failed' });
  }
};

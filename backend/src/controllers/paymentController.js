export const createPaymentIntent = async (req, res) => {
  // Mock payment: validate amount and return a fake clientSecret/paymentId
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  const id = `pi_mock_${Math.random().toString(36).slice(2, 10)}`;
  // In real Stripe: create PaymentIntent here
  res.status(201).json({ paymentId: id, clientSecret: `${id}_secret_mock` });
};

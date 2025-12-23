import { Router } from 'express';
import { body } from 'express-validator';
import { signup, signupOwner, login, loginOwner, me, forgotPassword, resetPassword } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signup);

// Owner signup
router.post('/signup-owner', [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signupOwner);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], login);

// Helpful response for browsers/health-checks hitting this endpoint with GET.
// Real authentication uses POST /api/auth/login.
router.get('/login', (_req, res) => {
  res.status(200).json({ message: 'Use POST /api/auth/login' });
});

// Owner-only login
router.post('/login-owner', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], loginOwner);

router.get('/login-owner', (_req, res) => {
  res.status(200).json({ message: 'Use POST /api/auth/login-owner' });
});

router.get('/me', auth, me);

router.post('/forgot', [
  body('email').isEmail()
], forgotPassword);

router.post('/reset', [
  body('token').isString().notEmpty(),
  body('password').isLength({ min: 6 })
], resetPassword);

export default router;

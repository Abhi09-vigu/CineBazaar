import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, me, forgotPassword, resetPassword } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signup);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], login);

router.get('/me', auth, me);

router.post('/forgot', [
  body('email').isEmail()
], forgotPassword);

router.post('/reset', [
  body('token').isString().notEmpty(),
  body('password').isLength({ min: 6 })
], resetPassword);

export default router;

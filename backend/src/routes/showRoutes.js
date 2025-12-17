import { Router } from 'express';
import { body } from 'express-validator';
import { auth, requireRole } from '../middleware/auth.js';
import { createShow, updateShow, deleteShow, listShows, getShow } from '../controllers/showController.js';

const router = Router();

router.get('/', listShows);
router.get('/:id', getShow);

router.post('/', auth, requireRole('ADMIN'), [
  body('movie').isMongoId(),
  body('theater').isMongoId(),
  body('date').isISO8601(),
  body('time').matches(/^\d{2}:\d{2}$/),
  body('seatPrice').isFloat({ min: 0 })
], createShow);

router.put('/:id', auth, requireRole('ADMIN'), updateShow);
router.delete('/:id', auth, requireRole('ADMIN'), deleteShow);

export default router;

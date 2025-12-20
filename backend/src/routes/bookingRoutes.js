import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { lockSeats, bookSeats, myBookings, cancelBooking, getTicket } from '../controllers/bookingController.js';

const router = Router();

router.post('/lock', auth, [
  body('showId').isMongoId(),
  body('seats').isArray({ min: 1 })
], lockSeats);

router.post('/book', auth, [
  body('showId').isMongoId(),
  body('seats').isArray({ min: 1 }),
  body('amount').isFloat({ min: 0 })
], bookSeats);

router.get('/me', auth, myBookings);
router.post('/cancel/:id', auth, cancelBooking);
router.get('/:id/ticket', auth, getTicket);

export default router;

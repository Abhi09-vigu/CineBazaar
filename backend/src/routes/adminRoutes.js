import { Router } from 'express';
import { body } from 'express-validator';
import { auth, admin } from '../middleware/auth.js';
import { createMovie } from '../controllers/movieController.js';
import { listPendingOwners, approveOwner } from '../controllers/adminController.js';
import { listPendingTheaters } from '../controllers/theaterController.js';

const router = Router();

// POST /api/admin/movies  (ADMIN only)
router.post('/movies', auth, admin, [
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('duration').isNumeric(),
  body('genre').isString().notEmpty(),
  body('language').isString().notEmpty(),
  body('releaseDate').isISO8601(),
  body('posterUrl').isURL().withMessage('posterUrl must be a valid URL')
], createMovie);

// GET /api/admin/owners/pending  (ADMIN only)
router.get('/owners/pending', auth, admin, listPendingOwners);

// POST /api/admin/owners/:id/approve  (ADMIN only)
router.post('/owners/:id/approve', auth, admin, approveOwner);

// GET /api/admin/theaters/pending (ADMIN only)
router.get('/theaters/pending', auth, admin, listPendingTheaters);

export default router;

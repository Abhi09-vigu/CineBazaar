import { Router } from 'express';
import { body } from 'express-validator';
import { auth, admin } from '../middleware/auth.js';
import { createMovie } from '../controllers/movieController.js';

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

export default router;

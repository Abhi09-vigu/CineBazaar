import { Router } from 'express';
import { body } from 'express-validator';
import { createMovie, updateMovie, deleteMovie, getMovies, getMovieById } from '../controllers/movieController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);

router.post('/', auth, requireRole('ADMIN'), [
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('duration').isNumeric(),
  body('genre').isString().notEmpty(),
  body('language').isString().notEmpty(),
  body('releaseDate').isISO8601(),
  body('posterUrl').isURL()
], createMovie);

router.put('/:id', auth, requireRole('ADMIN'), updateMovie);
router.delete('/:id', auth, requireRole('ADMIN'), deleteMovie);

export default router;

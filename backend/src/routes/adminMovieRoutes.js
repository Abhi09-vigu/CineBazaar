import { Router } from 'express';
import { body } from 'express-validator';
import { auth, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createMovie } from '../controllers/movieController.js';

const router = Router();

// Accept either posterUrl (URL) or image file under field name 'poster'
router.post('/movies', auth, admin, upload.single('poster'), [
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('duration').isNumeric(),
  body('genre').isString().notEmpty(),
  body('language').isString().notEmpty(),
  body('releaseDate').isISO8601(),
  body('posterUrl').optional().isURL()
], createMovie);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import { auth, requireRole } from '../middleware/auth.js';
import { createTheater, updateTheater, deleteTheater, listTheaters, importTheaterFromCatalog } from '../controllers/theaterController.js';

const router = Router();

router.get('/', listTheaters);

router.post('/', auth, requireRole('ADMIN'), [
  body('name').isString().notEmpty(),
  body('location').isString().notEmpty(),
  body('rows').isInt({ min: 1 }),
  body('cols').isInt({ min: 1 })
], createTheater);

router.put('/:id', auth, requireRole('ADMIN'), updateTheater);
router.delete('/:id', auth, requireRole('ADMIN'), deleteTheater);

// Import from catalog
router.post('/import-catalog', auth, requireRole('ADMIN'), importTheaterFromCatalog);

export default router;

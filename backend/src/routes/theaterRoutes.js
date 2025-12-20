import { Router } from 'express';
import { body } from 'express-validator';
import { auth, requireRole } from '../middleware/auth.js';
import { createTheater, updateTheater, deleteTheater, listTheaters, importTheaterFromCatalog, approveTheater } from '../controllers/theaterController.js';

const router = Router();

router.get('/', auth, listTheaters);

// Owners can submit theaters with detailed layout (requires owner approval)
router.post('/', auth, requireRole('OWNER'), [
  body('name').isString().notEmpty(),
  body('location').isString().notEmpty(),
  body('rows').optional().isInt({ min: 1 }),
  body('cols').optional().isInt({ min: 1 }),
  body('layout').optional().isArray()
], createTheater);

router.put('/:id', auth, requireRole('ADMIN', 'OWNER'), updateTheater);
router.delete('/:id', auth, requireRole('ADMIN', 'OWNER'), deleteTheater);

// Import from catalog
router.post('/import-catalog', auth, requireRole('ADMIN'), importTheaterFromCatalog);

// Approve a theater (ADMIN only)
router.post('/:id/approve', auth, requireRole('ADMIN'), approveTheater);

export default router;

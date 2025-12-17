import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminMovieRoutes from './adminMovieRoutes.js';
import movieRoutes from './movieRoutes.js';
import theaterRoutes from './theaterRoutes.js';
import theaterCatalogRoutes from './theaterCatalogRoutes.js';
import showRoutes from './showRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminMovieRoutes);
router.use('/movies', movieRoutes);
router.use('/theaters', theaterRoutes);
router.use('/theater-catalog', theaterCatalogRoutes);
router.use('/shows', showRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

export default router;

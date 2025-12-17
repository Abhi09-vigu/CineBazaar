import { Router } from 'express';
import { listTheaterCatalog, listTheaterNamesLocations } from '../controllers/theaterCatalogController.js';

const router = Router();

router.get('/', listTheaterCatalog);
router.get('/names-locations', listTheaterNamesLocations);

export default router;

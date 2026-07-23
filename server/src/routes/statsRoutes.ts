import { Router } from 'express';
import { getPlatformStats, getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getPlatformStats);
router.get('/dashboard', protect, getDashboardStats);

export default router;

import { Router } from 'express';
import { getDashboardApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/dashboard', protect, getDashboardApplications);
router.patch('/:id/status', protect, updateApplicationStatus);

export default router;

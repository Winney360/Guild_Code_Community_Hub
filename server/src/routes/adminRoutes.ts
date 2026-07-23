import { Router } from 'express';
import {
  adminGetUsers,
  adminApproveUser,
  adminSuspendUser,
  adminDeleteUser,
} from '../controllers/userController.js';
import {
  adminGetStats,
  adminGetModerationQueue,
  adminResolveReport,
  adminDismissReport,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Secure all admin endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/users', adminGetUsers);
router.patch('/users/:id/approve', adminApproveUser);
router.patch('/users/:id/suspend', adminSuspendUser);
router.delete('/users/:id', adminDeleteUser);

router.get('/stats', adminGetStats);
router.get('/moderation', adminGetModerationQueue);
router.post('/moderation/:id/resolve', adminResolveReport);
router.post('/moderation/:id/dismiss', adminDismissReport);

export default router;

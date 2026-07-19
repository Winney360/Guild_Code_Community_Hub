import { Router } from 'express';
import {
  getCollaborations,
  getCollaborationById,
  toggleCollaborationLike,
  createApplication,
} from '../controllers/collaborationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getCollaborations);
router.get('/:id', getCollaborationById);
router.post('/:id/like', protect, toggleCollaborationLike);
router.post('/:id/apply', protect, createApplication);

export default router;

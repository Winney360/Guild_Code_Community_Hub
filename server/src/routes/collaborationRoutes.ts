import { Router } from 'express';
import {
  getCollaborations,
  getMyCollaborations,
  getCollaborationById,
  createCollaboration,
  updateCollaboration,
  deleteCollaboration,
  toggleCollaborationLike,
  createApplication,
} from '../controllers/collaborationController.js';
import { createComment } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getCollaborations);
router.get('/my', protect, getMyCollaborations);
router.post('/', protect, createCollaboration);
router.get('/:id', getCollaborationById);
router.patch('/:id', protect, updateCollaboration);
router.delete('/:id', protect, deleteCollaboration);
router.post('/:id/like', protect, toggleCollaborationLike);
router.post('/:id/apply', protect, createApplication);
router.post('/:id/comments', protect, createComment);

export default router;

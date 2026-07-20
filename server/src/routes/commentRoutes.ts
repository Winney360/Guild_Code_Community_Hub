import { Router } from 'express';
import { deleteComment } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// @route   DELETE /api/comments/:id
router.delete('/:id', protect, deleteComment);

export default router;

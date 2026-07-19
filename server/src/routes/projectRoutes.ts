import { Router } from 'express';
import { getProjects, getProjectById, toggleProjectLike } from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/:id/like', protect, toggleProjectLike);

export default router;

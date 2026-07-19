import { Router } from 'express';
import {
  getProjects,
  getMyProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectLike,
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getProjects);
router.get('/my', protect, getMyProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.patch('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/like', protect, toggleProjectLike);

export default router;

import { Router } from 'express';
import {
  getProjects,
  getMyProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectLike,
  incrementProjectView,
} from '../controllers/projectController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getProjects);
router.get('/my', protect, getMyProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.post('/:id/view', incrementProjectView);
router.patch('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/like', optionalAuth, toggleProjectLike);

export default router;

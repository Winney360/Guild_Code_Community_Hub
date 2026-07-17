import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  updatePassword,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', protect, updateProfile);
router.patch('/:id/password', protect, updatePassword);

export default router;

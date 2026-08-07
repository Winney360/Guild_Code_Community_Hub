import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/authController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', optionalAuth, getMe);

export default router;

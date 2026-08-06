import { Router } from 'express';
import { signup, login, logout, getMe, oauthMock, googleAuth } from '../controllers/authController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/oauth-mock', oauthMock);
router.post('/logout', protect, logout);
router.get('/me', optionalAuth, getMe);

export default router;

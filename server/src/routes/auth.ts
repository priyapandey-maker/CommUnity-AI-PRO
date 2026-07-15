import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authMiddleware, logout);
authRouter.get('/me', authMiddleware, me);

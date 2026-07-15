import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

export const notificationRouter = Router();

notificationRouter.get('/', authMiddleware, getNotifications);
notificationRouter.patch('/:id/read', authMiddleware, markAsRead);

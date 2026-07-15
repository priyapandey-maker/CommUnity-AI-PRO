import { Router } from 'express';
import { getAnalytics, exportAnalytics, pollAnalytics } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { Role } from '@community-ai/shared';

export const analyticsRouter = Router();

analyticsRouter.get('/', authMiddleware, roleMiddleware([Role.AUTHORITY, Role.ADMIN]), getAnalytics);
analyticsRouter.get('/export', authMiddleware, roleMiddleware([Role.AUTHORITY, Role.ADMIN]), exportAnalytics);
analyticsRouter.get('/poll', authMiddleware, pollAnalytics);

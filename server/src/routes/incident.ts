import { Router } from 'express';
import { 
  createIncident, 
  getMyIncidents, 
  getIncidentById,
  acceptIncident,
  rejectIncident,
  assignIncident,
  updateIncidentStatus
} from '../controllers/incidentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { Role } from '@community-ai/shared';

export const incidentRouter = Router();

incidentRouter.post('/', optionalAuthMiddleware, createIncident);
incidentRouter.get('/my', authMiddleware, getMyIncidents);
incidentRouter.get('/:id', authMiddleware, getIncidentById);
const authorityAuth = [authMiddleware, roleMiddleware([Role.AUTHORITY, Role.ADMIN])];

incidentRouter.patch('/:id/accept', ...authorityAuth, acceptIncident);
incidentRouter.patch('/:id/reject', ...authorityAuth, rejectIncident);
incidentRouter.patch('/:id/assign', ...authorityAuth, assignIncident);
incidentRouter.patch('/:id/status', ...authorityAuth, updateIncidentStatus);

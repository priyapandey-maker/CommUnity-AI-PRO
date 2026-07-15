import { Router } from 'express';
import { createIncident, getMyIncidents, getIncidentById } from '../controllers/incidentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware';

export const incidentRouter = Router();

incidentRouter.post('/', optionalAuthMiddleware, createIncident);
incidentRouter.get('/my', authMiddleware, getMyIncidents);
incidentRouter.get('/:id', authMiddleware, getIncidentById);

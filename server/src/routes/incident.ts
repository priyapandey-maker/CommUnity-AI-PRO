import { Router } from 'express';
import { createIncident } from '../controllers/incidentController';

export const incidentRouter = Router();

incidentRouter.post('/', createIncident);

import { Router } from 'express';
import { analyzeIncident } from '../controllers/analyzeController';

export const analyzeRouter = Router();

analyzeRouter.post('/', analyzeIncident);

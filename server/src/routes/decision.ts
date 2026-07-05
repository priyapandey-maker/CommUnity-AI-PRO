import { Router } from 'express';
import { getDecision } from '../controllers/decisionController';

export const decisionRouter = Router();

decisionRouter.get('/:id', getDecision);

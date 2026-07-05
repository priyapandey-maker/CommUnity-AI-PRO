import { Router } from 'express';
import { getLedger } from '../controllers/ledgerController';

export const ledgerRouter = Router();

ledgerRouter.get('/', getLedger);

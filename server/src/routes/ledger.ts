import { Router } from 'express';
import { getLedger, getLedgerById } from '../controllers/ledgerController';

export const ledgerRouter = Router();

ledgerRouter.get('/', getLedger);
ledgerRouter.get('/:id', getLedgerById);

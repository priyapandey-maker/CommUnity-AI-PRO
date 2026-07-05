import { Request, Response } from 'express';
import { ledgerService } from '../services/ledgerService';

/**
 * Controller to fetch all entries in the public decision ledger.
 * Returns chronological history (oldest first).
 */
export const getLedger = (_req: Request, res: Response): void => {
  try {
    const history = ledgerService.getEntries();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while fetching ledger history.' });
  }
};

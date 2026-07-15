import { Request, Response } from 'express';
import { ledgerService } from '../services/ledgerService';
import { buildFullDecisionView } from '../utils/decisionView';

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

export const getLedgerById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    
    // First, find the ledger entry to get the underlying incidentId
    const ledgerEntry = ledgerService.getEntries().find(e => e.incidentId === id);
    if (!ledgerEntry) {
      res.status(404).json({ error: 'Ledger entry not found' });
      return;
    }

    const result = buildFullDecisionView(ledgerEntry.incidentId, req);

    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while retrieving ledger record.' });
  }
};

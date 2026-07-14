import { Request, Response, NextFunction } from 'express';
import { orchestrator } from '../services/AIOrchestrator';
import { decisionStoreService } from '../services/decisionStoreService';
import type { IncidentAnalysisInput } from '../knowledge/knowledgeService';

/**
 * Controller to fetch a specific decision from the decision store by ID.
 * Returns 404 if the requested record does not exist.
 */
export const getDecision = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const decisionRecord = decisionStoreService.getDecision(id);

    if (!decisionRecord) {
      res.status(404).json({ error: 'Decision not found' });
      return;
    }

    res.status(200).json(decisionRecord);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while retrieving decision record.' });
  }
};

/**
 * Controller to manually evaluate a decision based on analysis inputs.
 */
export const evaluateDecision = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const analysis: IncidentAnalysisInput = req.body;

    if (!analysis || !analysis.issueType || !analysis.severity) {
      res.status(400).json({ error: 'Valid analysis payload is required.' });
      return;
    }

    const decision = await orchestrator.run(analysis, true);

    res.status(200).json(decision);
  } catch (error) {
    next(error);
  }
};

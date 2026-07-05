import { Request, Response } from 'express';

export const analyzeIncident = (_req: Request, res: Response): void => {
  res.status(501).json({ message: 'Not Implemented' });
};

import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export const getAnalytics = (_req: Request, res: Response): void => {
  res.status(200).json(analyticsService.getAnalytics());
};

import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { ledgerService } from '../services/ledgerService';

export const getAnalytics = (_req: Request, res: Response): void => {
  res.status(200).json(analyticsService.getAnalytics());
};

export const exportAnalytics = (_req: Request, res: Response): void => {
  const data = analyticsService.getAnalytics();
  const ledgerEntries = ledgerService.getEntries();
  res.status(200).json({
    analytics: data,
    ledger: ledgerEntries
  });
};

export const pollAnalytics = (_req: Request, res: Response): void => {
  const data = analyticsService.getAnalytics();
  res.status(200).json({
    lastUpdated: data.lastUpdated
  });
};

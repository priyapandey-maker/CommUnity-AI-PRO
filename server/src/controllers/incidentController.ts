import { Request, Response, NextFunction } from 'express';
import { IncidentService } from '../services/incidentService';

const incidentService = new IncidentService();

/**
 * Controller to handle incident creation request.
 * Validates required inputs (description and location) and invokes service layer.
 */
export const createIncident = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { description, location, image } = req.body;

    // Validate required fields
    if (!description || typeof description !== 'string' || !description.trim()) {
      res.status(400).json({ error: 'Description is required and must be a non-empty string.' });
      return;
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      res.status(400).json({ error: 'Location is required and must be a non-empty string.' });
      return;
    }

    // Process incident through service layer
    const result = await incidentService.processIncident({
      description,
      location,
      image,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

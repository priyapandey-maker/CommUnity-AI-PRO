import { Request, Response, NextFunction } from 'express';
import { orchestrator } from '../services/AIOrchestrator';
import { incidentStore, IncidentRecord } from '../models/IncidentStore';
import { Role } from '@community-ai/shared';

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
    const result = await orchestrator.run({
      description,
      location,
      image,
      userId: req.user?.id, // Optional, depending on if authMiddleware is used
    });

    if ('incidentId' in result) {
      const record: IncidentRecord = {
        id: result.incidentId,
        userId: req.user?.id,
        description,
        location,
        image,
        status: 'ANALYZED',
        priority: result.decision?.priority || 'UNKNOWN',
        decisionId: result.incidentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      incidentStore.push(record);
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

import { ledgerService } from '../services/ledgerService';

export const getMyIncidents = (req: Request, res: Response): void => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const allEntries = ledgerService.getEntries();
  const myEntries = allEntries.filter(entry => entry.userId === userId);
  res.json(myEntries);
};

export const getIncidentById = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const incident = incidentStore.find(i => i.id === id);

  if (!incident) {
    res.status(404).json({ error: 'Incident not found' });
    return;
  }

  if (req.user.role === Role.CITIZEN && incident.userId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not have access to this incident' });
    return;
  }

  res.status(200).json(incident);
};

export const updateIncidentStatus = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || (req.user.role !== Role.AUTHORITY && req.user.role !== Role.ADMIN)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const { id } = req.params;
  const { status, department } = req.body;

  const incident = incidentStore.find(i => i.id === id);
  if (incident) {
    if (status) incident.status = status;
    incident.updatedAt = new Date();
  }

  const ledgerEntry = ledgerService.getEntries().find(e => e.incidentId === id);
  if (ledgerEntry) {
    if (status) ledgerEntry.status = status;
    if (department) ledgerEntry.department = department;
  }

  res.status(200).json({ success: true, status });
};

export const processDecision = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || (req.user.role !== Role.AUTHORITY && req.user.role !== Role.ADMIN)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const { id } = req.params;
  const { action } = req.body; // 'APPROVE' or 'REJECT'

  const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  const incident = incidentStore.find(i => i.id === id);
  if (incident) {
    incident.status = newStatus;
    incident.updatedAt = new Date();
  }

  const ledgerEntry = ledgerService.getEntries().find(e => e.incidentId === id);
  if (ledgerEntry) {
    ledgerEntry.status = newStatus;
  }

  res.status(200).json({ success: true, status: newStatus });
};

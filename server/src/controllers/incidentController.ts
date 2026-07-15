import { Request, Response, NextFunction } from 'express';
import { incidentStore, IncidentRecord } from '../models/IncidentStore';
import { Role } from '@community-ai/shared';
import { orchestrator } from '../services/AIOrchestrator';
import { ledgerService } from '../services/ledgerService';
import { decisionStoreService } from '../services/decisionStoreService';
import { notificationService } from '../services/notificationService';
import { analyticsService } from '../services/analyticsService';

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
        timeline: [{
          action: 'Incident Submitted',
          performedBy: req.user?.id || 'System',
          timestamp: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      incidentStore.push(record);
      analyticsService.refreshAnalytics();
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


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

const updateIncidentState = (
  req: Request,
  res: Response,
  actionMsg: string,
  newStatus: string,
  extraDetails?: string
) => {
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

  incident.status = newStatus;
  incident.updatedAt = new Date();
  
  const timelineAction = actionMsg;
  incident.timeline.push({
    action: timelineAction,
    performedBy: req.user.id,
    timestamp: new Date(),
    details: extraDetails
  });

  const decisionData = decisionStoreService.getDecision(incident.id);
  
  ledgerService.addEntry({
    incidentId: incident.id,
    issueType: decisionData?.analysis.issueType || 'Unknown',
    priority: incident.priority,
    recommendation: decisionData?.decision.recommendation || '',
    decisionReadiness: decisionData?.decision.decisionReadiness || 'LOW',
    status: newStatus,
    userId: req.user.id
  });

  if (incident.userId) {
    let type: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'RESOLUTION' | 'SYSTEM' = 'STATUS_CHANGE';
    if (newStatus === 'Assigned') type = 'ASSIGNMENT';
    if (newStatus === 'Resolved') type = 'RESOLUTION';
    
    notificationService.createNotification(
      incident.userId,
      `Your incident has an update: ${actionMsg}`,
      type,
      incident.id
    );
  }

  analyticsService.refreshAnalytics();

  res.status(200).json(incident);
};

export const acceptIncident = async (req: Request, res: Response): Promise<void> => {
  updateIncidentState(req, res, 'Accepted by Authority', 'Accepted');
};

export const rejectIncident = async (req: Request, res: Response): Promise<void> => {
  updateIncidentState(req, res, 'Rejected by Authority', 'Rejected');
};

export const assignIncident = async (req: Request, res: Response): Promise<void> => {
  const { department } = req.body;
  if (!department) {
    res.status(400).json({ error: 'Department is required for assignment' });
    return;
  }
  updateIncidentState(req, res, 'Assigned to Department', 'Assigned', `Department: ${department}`);
};

export const updateIncidentStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }
  // Standardize the action message based on status if possible
  const actionMsg = status === 'In Progress' 
    ? 'Status changed to In Progress' 
    : status === 'Resolved' 
      ? 'Status changed to Resolved' 
      : `Status changed to ${status}`;
      
  updateIncidentState(req, res, actionMsg, status);
};

export const getDepartmentQueue = (req: Request, res: Response): void => {
  if (!req.user || (req.user.role !== Role.AUTHORITY && req.user.role !== Role.ADMIN)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  const { department } = req.params;
  const queue = ledgerService.getEntries().filter(e => e.department === department || e.recommendation.includes(department));
  const incidentIds = queue.map(e => e.incidentId);
  const incidents = incidentStore.filter(i => incidentIds.includes(i.id));
  res.status(200).json(incidents);
};

export const getFilteredIncidents = (req: Request, res: Response): void => {
  if (!req.user || (req.user.role !== Role.AUTHORITY && req.user.role !== Role.ADMIN)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  const { status, priority } = req.query;
  let filtered = [...incidentStore];
  
  if (status) {
    filtered = filtered.filter(i => i.status === status);
  }
  if (priority) {
    filtered = filtered.filter(i => i.priority === priority);
  }
  
  // Sort by newest first
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  res.status(200).json(filtered);
};

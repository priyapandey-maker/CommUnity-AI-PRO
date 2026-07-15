import { decisionStoreService } from '../services/decisionStoreService';
import { incidentStore } from '../models/IncidentStore';
import { Role } from '@community-ai/shared';
import { Request } from 'express';

export const buildFullDecisionView = (decisionId: string, req: Request) => {
  const decisionRecord = decisionStoreService.getDecision(decisionId);
  const incidentRecord = incidentStore.find(i => i.id === decisionId); // incidentId == decisionId

  if (!decisionRecord && !incidentRecord) {
    return { error: 'Not found', status: 404 };
  }

  // Access Control
  const ownerId = incidentRecord?.userId || decisionRecord?.decision.evidence.find(e => e.factor === 'userId')?.value; // fallback
  if (req.user?.role === Role.CITIZEN && ownerId !== req.user.id) {
    return { error: 'Forbidden: You do not have access to this decision', status: 403 };
  }

  // Build full decision view
  const fullView = {
    decisionId: decisionRecord?.incidentId || incidentRecord?.id,
    incidentReference: incidentRecord ? {
      id: incidentRecord.id,
      description: incidentRecord.description,
      location: incidentRecord.location,
      status: incidentRecord.status,
      priority: incidentRecord.priority,
      createdAt: incidentRecord.createdAt,
    } : null,
    evidence: decisionRecord?.decision.evidence || [],
    recommendation: decisionRecord?.decision.recommendation || '',
    explanation: decisionRecord?.decision.explanation || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    confidence: (decisionRecord?.analysis as any)?.confidence || decisionRecord?.analysis.confidenceReason || 0,
    timeline: incidentRecord?.timeline || [],
    decisionReadiness: decisionRecord?.decision.decisionReadiness || 'LOW',
  };

  return { data: fullView, status: 200 };
};

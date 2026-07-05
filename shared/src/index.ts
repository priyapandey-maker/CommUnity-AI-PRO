import type { DecisionResult } from './decisionTypes';
export * from './decisionTypes';

export interface AnalyzeIncidentResult {
  issueType: string;
  severity: string;
  urgency: string;
  affectedAsset: string;
  possibleHazards: string[];
  confidenceReason: string;
  summary: string;
}

export interface IncidentApiResponse {
  incidentId: string;
  analysis: AnalyzeIncidentResult;
  decision: DecisionResult;
}

export interface IncidentFailedResponse {
  status: 'analysis_failed';
}

export type IncidentResponse = IncidentApiResponse | IncidentFailedResponse;

export type DecisionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DecisionReadiness = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidenceFactor {
  factor: string;
  value: string;
  weight: number;
  source: 'analysis' | 'context';
}

export interface DecisionResult {
  priority: DecisionPriority;
  recommendation: string;
  alternatives: string[];
  evidence: EvidenceFactor[];
  decisionReadiness: DecisionReadiness;
  explanation: string;
}

export interface DuplicateResult {
  duplicate: boolean;
  duplicates: string[];
  clusterId: string | null;
  similarityScore: number;
}

export interface LocationAnalysis {
  ward: string;
  zone: string;
  nearbyIncidents: string[];
  hotspotScore: number;
}

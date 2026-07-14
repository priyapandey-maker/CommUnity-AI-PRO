import type { AnalyzeIncidentResult, DecisionResult } from '@community-ai/shared';
import type { OperationalContext } from '../knowledge/knowledgeService';

export interface StoredDecision {
  incidentId: string;
  analysis: AnalyzeIncidentResult;
  knowledgeContext?: OperationalContext;
  decision: DecisionResult;
  timestamp: string;
}

export class DecisionStoreService {
  private store = new Map<string, StoredDecision>();

  /**
   * Saves a complete incident analysis and decision result to the in-memory store.
   * Orderly appends a generated timestamp.
   */
  public storeDecision(decision: Omit<StoredDecision, 'timestamp'>): StoredDecision {
    const stored: StoredDecision = {
      ...decision,
      timestamp: new Date().toISOString(),
    };
    this.store.set(decision.incidentId, stored);
    return stored;
  }

  /**
   * Retrieves a decision record by its incident ID. Returns null if not found.
   */
  public getDecision(id: string): StoredDecision | null {
    return this.store.get(id) || null;
  }

  /**
   * Retrieves all decision records from the in-memory store.
   */
  public getAllDecisions(): StoredDecision[] {
    return Array.from(this.store.values());
  }
}

export const decisionStoreService = new DecisionStoreService();

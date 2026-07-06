import { randomUUID } from 'crypto';
import { aiService } from './aiService';
import { KnowledgeService } from '../knowledge/knowledgeService';
import { decisionEngineService } from './decisionEngineService';
import { ledgerService } from './ledgerService';
import { decisionStoreService } from './decisionStoreService';
import { fallbackIncidentUnderstandingService } from './fallbackIncidentUnderstandingService';
import type { IncidentResponse, AnalyzeIncidentResult } from '@community-ai/shared';

// ── Types ─────────────────────────────────────────────────
export interface IncidentPayload {
  description: string;
  location: string;
  image?: string;
}

export class IncidentService {
  private knowledgeService = new KnowledgeService();

  /**
   * Processes the received incident data and calls the AI service for analysis.
   * Then runs the Evidence-to-Decision Pipeline (E2DP) deterministically.
   */
  public async processIncident(data: IncidentPayload): Promise<IncidentResponse> {
    const incidentId = randomUUID();

    try {
      // E2DP Step 1: Gemini Understanding (AI analysis) with Fallback
      let analysis: AnalyzeIncidentResult;
      try {
        analysis = await aiService.analyzeIncident({
          description: data.description,
          location: data.location,
          image: data.image,
        });
      } catch (err) {
        console.error('[IncidentService] AI analysis failed, falling back to rule-based analysis. Error:', err);
        analysis = fallbackIncidentUnderstandingService.analyzeIncident({
          description: data.description,
          location: data.location,
        });
      }

      // E2DP Step 2: Enrich with knowledge context
      const context = await this.knowledgeService.getContext({
        ...analysis,
        location: data.location
      });

      // E2DP Step 3: Deterministic decision engine evaluation
      const decision = decisionEngineService.evaluate(context);

      // E2DP Step 4: Write entry to the public transparency ledger
      ledgerService.addEntry({
        incidentId,
        issueType: analysis.issueType,
        priority: decision.priority,
        recommendation: decision.recommendation,
        decisionReadiness: decision.decisionReadiness,
      });

      // E2DP Step 5: Save complete analysis and decision to local memory store
      decisionStoreService.storeDecision({
        incidentId,
        analysis,
        knowledgeContext: context.operationalContext,
        decision,
      });

      return {
        incidentId,
        analysis,
        decision,
      };
    } catch (error) {
      console.error('[IncidentService Error] Failed to process incident pipeline:', error);
      return {
        status: 'analysis_failed',
      };
    }
  }
}

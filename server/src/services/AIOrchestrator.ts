import { randomUUID } from 'crypto';
import { aiService } from './aiService';
import { KnowledgeService } from '../knowledge/knowledgeService';
import type { IncidentAnalysisInput } from '../knowledge/knowledgeService';
import { decisionEngineService } from './decisionEngineService';
import { duplicateDetectionAgent } from './duplicateDetectionAgent';
import { ledgerService } from './ledgerService';
import { decisionStoreService } from './decisionStoreService';
import { fallbackIncidentUnderstandingService } from './fallbackIncidentUnderstandingService';
import type { IncidentResponse, AnalyzeIncidentResult, DecisionResult } from '@community-ai/shared';

export interface OrchestratorInput {
  description: string;
  location: string;
  image?: string;
}

// ── Placeholder AI Agents ───────────────────────────────────

class IncidentUnderstandingAgent {
  public async analyze(input: OrchestratorInput): Promise<AnalyzeIncidentResult> {
    try {
      return await aiService.analyzeIncident({
        description: input.description,
        location: input.location,
        image: input.image,
      });
    } catch (err) {
      console.error('[IncidentUnderstandingAgent] AI analysis failed, falling back.', err);
      return fallbackIncidentUnderstandingService.analyzeIncident({
        description: input.description,
        location: input.location,
      });
    }
  }
}

class LocationIntelligenceAgent {
  public async analyze(_location: string): Promise<unknown> {
    // Placeholder implementation for location intelligence
    return { ward: 'Unknown', zone: 'Unknown', nearbyIncidents: [], hotspotScore: 0 };
  }
}

class PriorityPredictionAgent {
  public async predict(_analysis: AnalyzeIncidentResult): Promise<unknown> {
    // Placeholder: Currently mapped to decisionEngineService for identical behavior
    return null; 
  }
}

class RecommendationAgent {
  public async recommend(_analysis: AnalyzeIncidentResult): Promise<unknown> {
    // Placeholder: Currently mapped to decisionEngineService for identical behavior
    return null;
  }
}

class ExplanationAgent {
  public async explain(_analysis: AnalyzeIncidentResult): Promise<unknown> {
    // Placeholder: Currently mapped to decisionEngineService for identical behavior
    return null;
  }
}

// ── AI Orchestrator ─────────────────────────────────────────

export class AIOrchestrator {
  private understandingAgent = new IncidentUnderstandingAgent();
  private duplicateAgent = duplicateDetectionAgent;
  private locationAgent = new LocationIntelligenceAgent();
  private priorityAgent = new PriorityPredictionAgent();
  private recommendationAgent = new RecommendationAgent();
  private explanationAgent = new ExplanationAgent();
  private knowledgeService = new KnowledgeService();

  /**
   * Main pipeline entry point.
   */
  public async run(input: OrchestratorInput): Promise<IncidentResponse>;
  /**
   * Manual evaluation entry point.
   */
  public async run(input: IncidentAnalysisInput, isEvaluateOnly: boolean): Promise<DecisionResult>;
  public async run(input: OrchestratorInput | IncidentAnalysisInput, isEvaluateOnly?: boolean): Promise<IncidentResponse | DecisionResult> {
    // Branch for the manual evaluateDecision controller endpoint
    if (isEvaluateOnly) {
      const context = await this.knowledgeService.getContext(input as IncidentAnalysisInput);
      return decisionEngineService.evaluate(context);
    }

    // Main AI Orchestrator Pipeline
    const payload = input as OrchestratorInput;
    const incidentId = randomUUID();

    try {
      // Agent 1: Incident Understanding
      const analysis = await this.understandingAgent.analyze(payload);
      
      // Agent 2: Duplicate Detection
      await this.duplicateAgent.detect(analysis);
      
      // Agent 3: Location Intelligence
      await this.locationAgent.analyze(payload.location);
      
      // Agent 4: Priority Prediction
      await this.priorityAgent.predict(analysis);
      
      // Agent 5: Recommendation
      await this.recommendationAgent.recommend(analysis);
      
      // Agent 6: Explanation
      await this.explanationAgent.explain(analysis);

      // Context Enrichment (Knowledge Graph interaction)
      const context = await this.knowledgeService.getContext({
        ...analysis,
        location: payload.location,
      });

      // Aggregate and resolve final decision
      const decision = decisionEngineService.evaluate(context);

      // Finalization and Storage
      ledgerService.addEntry({
        incidentId,
        issueType: analysis.issueType,
        priority: decision.priority,
        recommendation: decision.recommendation,
        decisionReadiness: decision.decisionReadiness,
      });

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
      console.error('[AIOrchestrator Error] Failed to process incident pipeline:', error);
      return {
        status: 'analysis_failed',
      };
    }
  }
}

export const orchestrator = new AIOrchestrator();

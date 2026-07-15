import { randomUUID } from 'crypto';
import { aiService } from './aiService';
import { KnowledgeService } from '../knowledge/knowledgeService';
import type { IncidentAnalysisInput } from '../knowledge/knowledgeService';
import { decisionEngineService } from './decisionEngineService';
import { duplicateDetectionAgent } from './duplicateDetectionAgent';
import { locationIntelligenceAgent } from './locationIntelligenceAgent';
import { priorityPredictionAgent } from './priorityPredictionAgent';
import { recommendationAgent } from './recommendationAgent';
import { explanationAgent } from './explanationAgent';
import { ledgerService } from './ledgerService';
import { decisionStoreService } from './decisionStoreService';
import { fallbackIncidentUnderstandingService } from './fallbackIncidentUnderstandingService';
import type { IncidentResponse, AnalyzeIncidentResult, DecisionResult } from '@community-ai/shared';

export interface OrchestratorInput {
  description: string;
  location: string;
  image?: string;
  userId?: string;
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


// ── AI Orchestrator ─────────────────────────────────────────

export class AIOrchestrator {
  private understandingAgent = new IncidentUnderstandingAgent();
  private duplicateAgent = duplicateDetectionAgent;
  private locationAgent = locationIntelligenceAgent;
  private priorityAgent = priorityPredictionAgent;
  private recommendationAgent = recommendationAgent;
  private explanationAgent = explanationAgent;
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
      const duplicateResult = await this.duplicateAgent.detect(analysis);
      
      // Agent 3: Location Intelligence
      const locationResult = await this.locationAgent.analyze(payload.location);
      
      // Agent 4: Priority Prediction
      const priorityResult = await this.priorityAgent.predict(analysis, locationResult, duplicateResult);
      
      // Agent 5: Recommendation
      const recommendationResult = await this.recommendationAgent.recommend(analysis, priorityResult);
      
      // Agent 6: Explanation
      const explanationResult = await this.explanationAgent.explain(analysis, priorityResult, recommendationResult);

      // Context Enrichment (Knowledge Graph interaction)
      const context = await this.knowledgeService.getContext({
        ...analysis,
        location: payload.location,
      });

      // Aggregate and resolve final decision
      const decision = decisionEngineService.evaluate(context);
      
      // Override deterministic fallback with Agent outputs
      decision.priority = priorityResult.priority;
      decision.recommendation = recommendationResult.actions.join(' ');
      // You can add more mapping here for explanation, alternatives, etc. if needed
      decision.explanation = explanationResult.reasoning;
      
      // For type compliance and preserving the actual objects for future iterations, 
      // we attach them to the response or just let the overrides handle it.

      // Finalization and Storage
      ledgerService.addEntry({
        incidentId,
        userId: payload.userId,
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

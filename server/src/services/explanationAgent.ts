import type { AnalyzeIncidentResult, PriorityPredictionResult, RecommendationResult, ExplanationResult } from '@community-ai/shared';

export class ExplanationAgent {
  /**
   * Deterministically generates human-readable reasoning and evidence summary
   * to explain the decisions made by previous agents.
   */
  public async explain(
    analysis: AnalyzeIncidentResult,
    priorityResult: PriorityPredictionResult,
    recommendationResult: RecommendationResult
  ): Promise<ExplanationResult> {
    const evidenceSummary: string[] = [];

    // 1. Summarize Analysis
    evidenceSummary.push(`Incident identified as: ${analysis.issueType}.`);
    
    // 2. Summarize Priority Justification
    evidenceSummary.push(`Priority set to ${priorityResult.priority} due to a risk score of ${priorityResult.riskScore}/100.`);
    
    // 3. Summarize Recommendation Justification
    if (recommendationResult.escalation) {
      evidenceSummary.push('Escalation required based on critical severity threshold.');
    }
    evidenceSummary.push(`Assigned to departments: ${recommendationResult.departments.join(', ')}.`);

    // 4. Construct Human-Readable Reasoning
    const reasoning = `This incident has been categorized as a ${priorityResult.priority} priority ${analysis.issueType} issue. `
      + `We recommend resolving this within ${priorityResult.recommendedSLA}. `
      + `The primary action is to: ${recommendationResult.actions[0] || 'Investigate further.'}`;

    return {
      reasoning,
      confidence: 0.95, // High deterministic confidence
      evidenceSummary
    };
  }
}

export const explanationAgent = new ExplanationAgent();

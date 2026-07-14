import type { 
  AnalyzeIncidentResult, 
  LocationAnalysis, 
  DuplicateResult, 
  PriorityPredictionResult, 
  DecisionPriority 
} from '@community-ai/shared';

export class PriorityPredictionAgent {
  /**
   * Deterministically predicts priority, risk score, and SLA based on 
   * severity, location intelligence, historical context (hotspots), and duplicates.
   */
  public async predict(
    analysis: AnalyzeIncidentResult,
    location: LocationAnalysis,
    duplicateResult: DuplicateResult
  ): Promise<PriorityPredictionResult> {
    
    let baseScore = 0;
    
    // 1. Incorporate Severity (derived from Issue Type & Summary implicitly in deterministic model)
    const issueType = analysis.issueType.toLowerCase();
    if (issueType.includes('safety') || issueType.includes('emergency') || issueType.includes('security')) {
      baseScore += 50;
    } else if (issueType.includes('infrastructure') || issueType.includes('repair') || issueType.includes('water')) {
      baseScore += 30;
    } else {
      baseScore += 10;
    }
    
    // 2. Incorporate Historical Context & Location (via Hotspot Score)
    baseScore += (location.hotspotScore * 0.2); // Max contribution: 20
    
    // 3. Incorporate Duplicates (High duplicate volume implies wider impact)
    if (duplicateResult.duplicate) {
       baseScore += Math.min(duplicateResult.duplicates.length * 10, 30); // Max contribution: 30
    }
    
    // 4. Resolve Priority and SLA
    let priority: DecisionPriority = 'LOW';
    let recommendedSLA = '72 hours';
    
    if (baseScore >= 75) {
      priority = 'CRITICAL';
      recommendedSLA = '2 hours';
    } else if (baseScore >= 50) {
      priority = 'HIGH';
      recommendedSLA = '12 hours';
    } else if (baseScore >= 25) {
      priority = 'MEDIUM';
      recommendedSLA = '24 hours';
    }
    
    return {
      priority,
      riskScore: Math.min(Math.round(baseScore), 100),
      recommendedSLA,
      confidence: 0.92 // Static high confidence for deterministic model
    };
  }
}

export const priorityPredictionAgent = new PriorityPredictionAgent();

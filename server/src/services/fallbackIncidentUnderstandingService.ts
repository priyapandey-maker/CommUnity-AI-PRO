import type { AnalyzeIncidentResult } from '@community-ai/shared';

export interface FallbackIncidentPayload {
  description: string;
  location: string;
}

export class FallbackIncidentUnderstandingService {
  /**
   * Generates a deterministic, rule-based incident analysis using keyword matching.
   */
  public analyzeIncident(params: FallbackIncidentPayload): AnalyzeIncidentResult {
    const desc = params.description.toLowerCase();
    let issueType = 'General Infrastructure';

    // Rule-based keyword matching (ordered deterministically)
    if (desc.includes('pothole')) {
      issueType = 'Road Infrastructure';
    } else if (desc.includes('garbage')) {
      issueType = 'Waste Management';
    } else if (desc.includes('flood')) {
      issueType = 'Environment';
    } else if (desc.includes('accident')) {
      issueType = 'Public Safety';
    } else if (desc.includes('light')) {
      issueType = 'Street Lighting';
    } else if (desc.includes('water')) {
      issueType = 'Utilities';
    } else if (desc.includes('electricity')) {
      issueType = 'Utilities';
    } else if (desc.includes('hospital')) {
      issueType = 'Healthcare';
    } else if (desc.includes('school')) {
      issueType = 'Education';
    }

    return {
      issueType,
      severity: 'MEDIUM',
      urgency: 'MEDIUM',
      affectedAsset: 'Public Infrastructure',
      possibleHazards: ['Standard operational hazards apply'],
      confidenceReason: 'Deterministic fallback routing due to AI service unavailability',
      summary: `Automated fallback report for issue: ${params.description.substring(0, 100)}${params.description.length > 100 ? '...' : ''}`,
      source: 'fallback',
    };
  }
}

export const fallbackIncidentUnderstandingService = new FallbackIncidentUnderstandingService();

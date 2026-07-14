import type { AnalyzeIncidentResult, PriorityPredictionResult, RecommendationResult } from '@community-ai/shared';

export class RecommendationAgent {
  /**
   * Deterministically generates recommended actions, departments, and escalation flags
   * based on the incident analysis and predicted priority.
   */
  public async recommend(
    analysis: AnalyzeIncidentResult,
    priorityResult: PriorityPredictionResult
  ): Promise<RecommendationResult> {
    const issueType = analysis.issueType.toLowerCase();
    const departments: string[] = [];
    const actions: string[] = [];

    // 1. Assign Departments based on Issue Type
    if (issueType.includes('water') || issueType.includes('plumbing')) {
      departments.push('Water & Sanitation');
      actions.push('Dispatch field crew to inspect water lines.');
    } else if (issueType.includes('safety') || issueType.includes('security')) {
      departments.push('Public Safety');
      actions.push('Notify local security personnel.');
    } else if (issueType.includes('power') || issueType.includes('electricity')) {
      departments.push('Electrical Board');
      actions.push('Check power grid status in the affected zone.');
    } else {
      departments.push('General Maintenance');
      actions.push('Schedule general inspection.');
    }

    // 2. Add Priority-based Actions
    let escalation = false;
    if (priorityResult.priority === 'CRITICAL') {
      departments.push('Emergency Response Team');
      actions.unshift('IMMEDIATE ACTION REQUIRED: Deploy emergency services.');
      escalation = true;
    } else if (priorityResult.priority === 'HIGH') {
      actions.unshift('Elevate ticket to senior supervisor.');
    }

    return {
      departments: [...new Set(departments)], // Ensure unique departments
      actions,
      escalation
    };
  }
}

export const recommendationAgent = new RecommendationAgent();

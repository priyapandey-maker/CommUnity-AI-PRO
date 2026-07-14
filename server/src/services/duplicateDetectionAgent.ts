import type { AnalyzeIncidentResult, DuplicateResult } from '@community-ai/shared';
import { decisionStoreService } from './decisionStoreService';

export class DuplicateDetectionAgent {
  private readonly SIMILARITY_THRESHOLD = 0.6;

  /**
   * Deterministically calculates similarity between a new incident and historical incidents.
   */
  public async detect(currentAnalysis: AnalyzeIncidentResult): Promise<DuplicateResult> {
    const history = decisionStoreService.getAllDecisions();

    let highestScore = 0;
    const duplicates: string[] = [];

    const currentKeywords = this.extractKeywords(currentAnalysis);

    for (const record of history) {
      // Do not compare against identical categories to save time? Actually, compare against same issue type
      if (record.analysis.issueType !== currentAnalysis.issueType) {
        continue;
      }

      const historyKeywords = this.extractKeywords(record.analysis);
      const score = this.calculateJaccardSimilarity(currentKeywords, historyKeywords);

      if (score > highestScore) {
        highestScore = score;
      }

      if (score >= this.SIMILARITY_THRESHOLD) {
        duplicates.push(record.incidentId);
      }
    }

    const isDuplicate = duplicates.length > 0;
    let clusterId = null;

    if (isDuplicate) {
      // Deterministically set clusterId to the first found duplicate to group them together
      clusterId = `cluster-${duplicates[0]}`;
    }

    return {
      duplicate: isDuplicate,
      duplicates,
      clusterId,
      similarityScore: Number(highestScore.toFixed(2)),
    };
  }

  /**
   * Tokenizes text and extracts simple alphanumeric keywords.
   */
  private extractKeywords(analysis: AnalyzeIncidentResult): Set<string> {
    const text = `${analysis.summary} ${analysis.affectedAsset} ${(analysis.possibleHazards || []).join(' ')}`.toLowerCase();
    const words = text.split(/\W+/).filter(w => w.length > 3);
    return new Set(words);
  }

  /**
   * Calculates the Jaccard Similarity index between two sets.
   */
  private calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 && setB.size === 0) return 0;
    
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) {
        intersection++;
      }
    }
    
    const union = setA.size + setB.size - intersection;
    if (union === 0) return 0;

    return intersection / union;
  }
}

export const duplicateDetectionAgent = new DuplicateDetectionAgent();

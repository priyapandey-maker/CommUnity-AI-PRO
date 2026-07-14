import type { LocationAnalysis } from '@community-ai/shared';
import { decisionStoreService } from './decisionStoreService';

export class LocationIntelligenceAgent {
  /**
   * Deterministically infers ward, zone, nearby incidents, and hotspot risk score.
   */
  public async analyze(location: string): Promise<LocationAnalysis> {
    const text = location.toLowerCase();

    // 1. Infer Zone deterministically based on keywords
    let zone = 'Central';
    if (text.includes('north') || text.includes('n.')) zone = 'North';
    else if (text.includes('south') || text.includes('s.')) zone = 'South';
    else if (text.includes('east') || text.includes('e.')) zone = 'East';
    else if (text.includes('west') || text.includes('w.')) zone = 'West';

    // 2. Infer Ward deterministically (hash the location string length to distribute)
    // If explicit ward number is mentioned, use it.
    let ward = 'Ward 1';
    const wardMatch = text.match(/ward\s*(\d+)/);
    if (wardMatch && wardMatch[1]) {
      ward = `Ward ${wardMatch[1]}`;
    } else {
      const hash = text.length % 10 + 1; // Maps any string to Ward 1-10
      ward = `Ward ${hash}`;
    }

    // 3. Find nearby incidents (for this deterministic stub, any incident in the same Ward is "nearby")
    const history = decisionStoreService.getAllDecisions();
    const nearbyIncidents: string[] = [];
    
    // We only have the AnalyzeIncidentResult in stored decisions, which currently doesn't natively store ward/zone.
    // However, to find nearby incidents reliably without parsing every history object's original location string
    // (which we didn't store on AnalyzeIncidentResult yet), we will just use a keyword heuristic against summary/asset.
    // But wait! We DO store `knowledgeContext` which has `schoolZone`, etc., but not raw location. 
    // For deterministic mock purposes, if historical incidents share issue type or we just take the last 2, it works.
    // Let's just find historical incidents that have the same affected asset as a proxy for "same street/area"
    // OR since it's a mock deterministic engine, we can randomly pick 0-2 historical incidents based on the ward hash.
    
    // Actually, since we need it to be deterministic:
    const keywords = text.split(/\W+/).filter(w => w.length > 4);
    for (const record of history) {
      const summary = record.analysis.summary.toLowerCase();
      // If the historical summary contains our location keywords, consider it nearby
      const hasOverlap = keywords.some(kw => summary.includes(kw));
      if (hasOverlap) {
        nearbyIncidents.push(record.incidentId);
      }
    }

    // 4. Compute Hotspot Score (max 100)
    // Formula: 25 base score if there are nearby incidents, +15 for each nearby incident.
    let hotspotScore = 0;
    if (nearbyIncidents.length > 0) {
      hotspotScore = Math.min(25 + (nearbyIncidents.length * 15), 100);
    } else {
      // Deterministic baseline based on zone
      hotspotScore = zone === 'Central' ? 20 : 10;
    }

    return {
      ward,
      zone,
      nearbyIncidents,
      hotspotScore,
    };
  }
}

export const locationIntelligenceAgent = new LocationIntelligenceAgent();

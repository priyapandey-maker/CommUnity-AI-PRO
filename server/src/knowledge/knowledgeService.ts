import * as fs from 'fs/promises';
import * as path from 'path';

export interface IncidentAnalysisInput {
  issueType: string;
  severity: string;
  urgency: string;
  affectedAsset: string;
  possibleHazards: string[];
  confidenceReason?: string;
  summary: string;
  location?: string;
}

export interface OperationalContext {
  schoolZone: boolean;
  recentRain: boolean;
  maintenanceHistory: number;
  crewAvailable: boolean;
  criticalInfrastructure: boolean;
}

export interface EnrichedIncidentContext {
  analysis: IncidentAnalysisInput;
  operationalContext: OperationalContext;
}

export class KnowledgeService {
  private jsonPath = path.join(__dirname, 'knowledgeBase.json');

  /**
   * Enriches the parsed Gemini incident analysis with contextual operational knowledge.
   * Exposes an async Promise API so it is easily swappable with a real database/repository layer later.
   */
  public async getContext(analysis: IncidentAnalysisInput): Promise<EnrichedIncidentContext> {
    try {
      const fileContent = await fs.readFile(this.jsonPath, 'utf8');
      const data = JSON.parse(fileContent);

      const locationKey = this.normaliseLocation(analysis.location);
      const operationalContext: OperationalContext =
        data.locations[locationKey] || data.locations['default'];

      return {
        analysis,
        operationalContext,
      };
    } catch (error) {
      // Fallback fallback default context on read/parse failures
      return {
        analysis,
        operationalContext: {
          schoolZone: false,
          recentRain: false,
          maintenanceHistory: 0,
          crewAvailable: true,
          criticalInfrastructure: false,
        },
      };
    }
  }

  /**
   * Helper to resolve the incident location string to a matching key in our JSON database.
   */
  private normaliseLocation(location?: string): string {
    if (!location) return 'default';
    const loc = location.toLowerCase();
    if (loc.includes('school')) return 'school-street';
    if (loc.includes('broadway')) return 'broadway-ave';
    return 'default';
  }
}

import { GoogleGenAI, Type } from '@google/genai';
import { INCIDENT_UNDERSTANDING_SYSTEM_PROMPT } from '../prompts';

// ── Simple Logger ─────────────────────────────────────────
const aiLogger = {
  info: (_msg: string, _meta?: Record<string, unknown>) => {
    // Debug logs removed for production
  },
  error: (msg: string, err?: unknown) => {
    console.error(`[AI ERROR] ${msg}`, err instanceof Error ? err.message : err);
  },
};

// ── Types ─────────────────────────────────────────────────
export interface AnalyzeIncidentParams {
  description: string;
  location: string;
  image?: string;
}

export interface AnalyzeIncidentResult {
  issueType: string;
  severity: string;
  urgency: string;
  affectedAsset: string;
  possibleHazards: string[];
  confidenceReason: string;
  summary: string;
  source?: 'gemini' | 'fallback';
}

interface TextContent {
  text: string;
}

interface InlineDataContent {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

type GeminiContentInput = TextContent | InlineDataContent;

// ── Service ───────────────────────────────────────────────
export class AIService {
  private ai: GoogleGenAI;
  private readonly TIMEOUT_MS = 30000;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      aiLogger.error('GEMINI_API_KEY is missing from the environment variables.');
    }
    
    // The SDK defaults to using process.env.GEMINI_API_KEY
    this.ai = new GoogleGenAI(apiKey ? { apiKey } : {});
  }

  /**
   * Analyzes the given incident using Gemini 2.5 Flash and returns parsed JSON.
   */
  public async analyzeIncident(params: AnalyzeIncidentParams): Promise<AnalyzeIncidentResult> {
    aiLogger.info('Starting incident analysis', { location: params.location, hasImage: String(!!params.image) });

    try {
      // 1. Prepare contents
      const userPrompt = `Incident Report to Analyze:
Description: ${params.description}
Location: ${params.location}`;

      const contents: GeminiContentInput[] = [
        { text: userPrompt }
      ];

      // 2. Handle optional image
      if (params.image) {
        const base64Data = params.image.replace(/^data:image\/\w+;base64,/, '');
        
        let mimeType = 'image/jpeg';
        const mimeMatch = params.image.match(/^data:(image\/\w+);base64,/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }

        contents.unshift({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          }
        });
      }

      // 3. Define the structured output schema based on standard prompts
      const config = {
        systemInstruction: INCIDENT_UNDERSTANDING_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issueType: {
              type: Type.STRING,
              description: 'Categorized type of the incident (e.g., Road Hazard, Water Leak, Downed Power Line)',
            },
            severity: {
              type: Type.STRING,
              description: 'Severity classification (e.g., Low, Medium, High, Critical)',
            },
            urgency: {
              type: Type.STRING,
              description: 'Urgency rating (e.g., Low, Medium, High, Immediate)',
            },
            affectedAsset: {
              type: Type.STRING,
              description: 'The physical asset or infrastructure affected (e.g., Pavement, Water Main, Power Grid)',
            },
            possibleHazards: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Potential safety or environmental hazards identified',
            },
            confidenceReason: {
              type: Type.STRING,
              description: 'Justification for severity and urgency levels assigned',
            },
            summary: {
              type: Type.STRING,
              description: 'A concise, objective summary of the situation based ONLY on facts',
            },
          },
          required: [
            'issueType',
            'severity',
            'urgency',
            'affectedAsset',
            'possibleHazards',
            'confidenceReason',
            'summary',
          ],
        },
      };

      // 4. Execute the call with a timeout
      const aiPromise = this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: config,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('AI Request timed out')), this.TIMEOUT_MS);
      });

      const response = await Promise.race([aiPromise, timeoutPromise]);

      if (!response.text) {
        throw new Error('No text returned from Gemini API');
      }

      // 5. Parse the JSON result
      const parsedResult: AnalyzeIncidentResult = JSON.parse(response.text);
      parsedResult.source = 'gemini';
      
      aiLogger.info('Incident analysis completed successfully', { 
        issueType: parsedResult.issueType, 
        severity: parsedResult.severity 
      });
      
      return parsedResult;

    } catch (error: unknown) {
      aiLogger.error('Failed to analyze incident', error);
      throw new Error(`AI Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const aiService = new AIService();

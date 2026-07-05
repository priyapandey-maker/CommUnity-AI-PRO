import { GoogleGenAI, Type } from '@google/genai';

// ── Simple Logger ─────────────────────────────────────────
const aiLogger = {
  info: (msg: string, meta?: any) => {
    console.log(`[AI INFO] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  error: (msg: string, err?: any) => {
    console.error(`[AI ERROR] ${msg}`, err instanceof Error ? err.message : err);
  },
};

// ── Types ─────────────────────────────────────────────────
export interface AnalyzeIncidentParams {
  description: string;
  location: string;
  /**
   * Optional base64 encoded image string (e.g. data:image/jpeg;base64,...)
   */
  image?: string;
}

export interface AnalyzeIncidentResult {
  severity: string;
  category: string;
  recommendedAction: string;
}

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
    aiLogger.info('Starting incident analysis', { location: params.location, hasImage: !!params.image });

    try {
      // 1. Prepare contents
      const prompt = `Analyze the following incident report.
Description: ${params.description}
Location: ${params.location}

Provide a severity (e.g., Low, Medium, High, Critical), a general category (e.g., Infrastructure, Safety, Cleanliness), and a recommended immediate action.`;

      const contents: any[] = [
        { text: prompt }
      ];

      // 2. Handle optional image
      if (params.image) {
        // Strip data URL prefix if present and extract mime type
        const base64Data = params.image.replace(/^data:image\/\w+;base64,/, '');
        
        let mimeType = 'image/jpeg'; // Default fallback
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

      // 3. Define the structured output schema
      const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              description: 'The severity of the incident (e.g., Low, Medium, High, Critical)',
            },
            category: {
              type: Type.STRING,
              description: 'The general category of the incident',
            },
            recommendedAction: {
              type: Type.STRING,
              description: 'A recommended immediate action to address the incident',
            },
          },
          required: ['severity', 'category', 'recommendedAction'],
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
      
      aiLogger.info('Incident analysis completed successfully', { category: parsedResult.category, severity: parsedResult.severity });
      
      return parsedResult;

    } catch (error: any) {
      aiLogger.error('Failed to analyze incident', error);
      throw new Error(`AI Analysis failed: ${error.message || 'Unknown error'}`);
    }
  }
}

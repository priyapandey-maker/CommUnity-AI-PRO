import apiClient from './apiClient';

// ── Types ─────────────────────────────────────────────────

export interface IncidentPayload {
  description: string;
  location: string;
  /** Optional image file — converted to base64 before sending. */
  image?: File | null;
}

export interface IncidentApiResponse {
  id: string;
  status: string;
}

// ── Helpers ───────────────────────────────────────────────

/**
 * Converts a File to a base64 data-URL string.
 * Returns null if no file is provided.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

// ── Service ───────────────────────────────────────────────

/**
 * POST /incident
 *
 * Sends the incident report to the backend.
 * If an image file is provided it is converted to a base64 data-URL and
 * included in the JSON body as `imageBase64`.
 *
 * @throws {ApiError} On network failure or non-2xx response.
 */
export async function submitIncident(
  payload: IncidentPayload,
): Promise<IncidentApiResponse> {
  const body: Record<string, unknown> = {
    description: payload.description,
    location:    payload.location,
  };

  if (payload.image) {
    body.imageBase64 = await fileToBase64(payload.image);
  }

  const { data } = await apiClient.post<IncidentApiResponse>('/incident', body);
  return data;
}

export interface DecisionResponse {
  id: string;
  issueType: string;
  severity: string;
  urgency: string;
  affectedAsset: string;
  possibleHazards: string[];
  confidenceReason?: string;
  summary: string;
}

/**
 * GET /decision/:id
 *
 * Fetches the AI analysis decision from the backend.
 *
 * @throws {ApiError} On network failure or non-2xx response.
 */
export async function getDecision(id: string): Promise<DecisionResponse> {
  const { data } = await apiClient.get<DecisionResponse>(`/decision/${id}`);
  return data;
}


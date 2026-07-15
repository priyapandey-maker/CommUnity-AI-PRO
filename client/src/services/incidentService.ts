import apiClient from './apiClient';
import type { IncidentResponse, IncidentApiResponse as SharedIncidentApiResponse } from '@community-ai/shared';

// ── Types ─────────────────────────────────────────────────

export interface IncidentPayload {
  description: string;
  location: string;
  /** Optional image file — converted to base64 before sending. */
  image?: File | null;
}

export type IncidentApiResponse = IncidentResponse;

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

export type DecisionResponse = SharedIncidentApiResponse;


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

export interface LedgerEntry {
  incidentId: string;
  timestamp: string;
  issueType: string;
  priority: string;
  recommendation: string;
  decisionReadiness: string;
  status: string;
}

/**
 * GET /ledger
 *
 * Fetches all logged decisions from the backend in chronological order.
 *
 * @throws {ApiError} On network failure or non-2xx response.
 */
export async function getLedger(): Promise<LedgerEntry[]> {
  const { data } = await apiClient.get<LedgerEntry[]>('/ledger');
  return data;
}

/**
 * GET /incident/my
 *
 * Fetches incidents created by the currently authenticated user.
 */
export async function getMyIncidents(): Promise<LedgerEntry[]> {
  const { data } = await apiClient.get<LedgerEntry[]>('/incident/my');
  return data;
}

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitIncident, parseApiError } from '@/services';
import type { IncidentPayload } from '@/services';

// ── Return type ───────────────────────────────────────────
export interface UseSubmitIncidentReturn {
  /** True while the POST /incident request is in-flight. */
  isLoading: boolean;
  /** Human-readable error message if the last submission failed. */
  error: string | null;
  /** Clear any existing error (e.g. when the user edits a field). */
  clearError: () => void;
  /** Submit the incident; navigates to /decision/:id on success. */
  submit: (payload: IncidentPayload) => Promise<void>;
}

// ── Hook ──────────────────────────────────────────────────
/**
 * useSubmitIncident
 *
 * Encapsulates the full lifecycle of a POST /incident call:
 * - loading state
 * - error normalisation via parseApiError
 * - navigation to /decision/:id on success
 */
export function useSubmitIncident(): UseSubmitIncidentReturn {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submit = useCallback(
    async (payload: IncidentPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await submitIncident(payload);
        navigate(`/decision/${response.id}`);
      } catch (err) {
        const apiErr = parseApiError(err);
        setError(apiErr.message);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  return { isLoading, error, clearError, submit };
}

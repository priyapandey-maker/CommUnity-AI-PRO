import { AxiosError } from 'axios';

// ── ApiError ─────────────────────────────────────────────
/**
 * Normalised error shape used across all service calls.
 * Always carries a human-readable `message`, an HTTP `status` (0 for network errors),
 * and the raw `data` returned by the server (if any).
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ── parseApiError ─────────────────────────────────────────
/**
 * Converts any thrown value into an `ApiError`.
 *
 * Priority order for the message:
 * 1. `error.response.data.error`  — server-sent error field
 * 2. `error.response.data.message` — server-sent message field
 * 3. `error.message`              — Axios or native message
 * 4. Generic fallback
 */
export function parseApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof AxiosError) {
    const status  = err.response?.status  ?? 0;
    const data    = err.response?.data;
    const message =
      (typeof data === 'object' && data !== null && 'error'   in data
        ? String((data as Record<string, unknown>).error)
        : null) ??
      (typeof data === 'object' && data !== null && 'message' in data
        ? String((data as Record<string, unknown>).message)
        : null) ??
      err.message ??
      'An unexpected error occurred.';

    return new ApiError(message, status, data);
  }

  if (err instanceof Error) {
    return new ApiError(err.message, 0);
  }

  return new ApiError('An unexpected error occurred.', 0);
}

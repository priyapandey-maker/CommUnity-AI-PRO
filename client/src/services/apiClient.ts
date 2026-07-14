import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * Base URL is read from the VITE_API_URL environment variable (falls back to /api via Vite proxy).
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});


// ── Response interceptor ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Re-throw so callers can use parseApiError()
    return Promise.reject(error);
  },
);

export default apiClient;

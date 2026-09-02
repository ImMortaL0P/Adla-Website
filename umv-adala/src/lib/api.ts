/**
 * Base URL of the notices/admin backend.
 * In development, we use the local server dynamically.
 * In production, it's an empty string because the Node backend serves the frontend (relative paths).
 */
export const API_URL = import.meta.env.DEV ? (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5001` : 'http://localhost:5001') : '';

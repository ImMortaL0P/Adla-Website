/**
 * Base URL of the notices/admin backend. Set VITE_API_URL at build time to
 * point at the deployed backend — falls back to local dev only otherwise,
 * since a hardcoded localhost URL would silently fail in production.
 */
export const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5001` : 'http://localhost:5001')

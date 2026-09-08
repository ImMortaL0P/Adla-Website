/**
 * Base URL of the backend.
 * In production or remote deployments, this should fall back to VITE_API_URL.
 */
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:10000` : 'http://localhost:10000') : '');

/**
 * Resolves a media URL returned by the backend. Uploaded images are served
 * through our own /api/media/:fileId proxy rather than Google's public Drive thumbnail link.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  // If the url is already absolute (starts with http), return it.
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If the url is relative, resolve it against the API_URL (if API_URL is present, otherwise keep it relative).
  return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`;
}

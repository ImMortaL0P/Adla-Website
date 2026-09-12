let rawApiUrl = import.meta.env.VITE_API_URL || '';
if (rawApiUrl && !rawApiUrl.startsWith('http')) {
  rawApiUrl = 'https://' + rawApiUrl;
}
rawApiUrl = rawApiUrl.replace(/\/$/, '');

/**
 * Base URL of the backend.
 * In production or remote deployments, this should fall back to VITE_API_URL.
 */
export const API_URL = rawApiUrl || (import.meta.env.DEV ? (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5001` : 'http://localhost:5001') : '');

/**
 * Resolves a media URL returned by the backend. Uploaded images are served
 * through our own /api/media/:fileId proxy rather than Google's public Drive thumbnail link.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`;
}

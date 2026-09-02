/**
 * Base URL of the notices/admin backend.
 * In development, we use the local server dynamically.
 * In production, it's an empty string because the Node backend serves the frontend (relative paths).
 */
export const API_URL = import.meta.env.DEV ? (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5001` : 'http://localhost:5001') : '';

/**
 * Resolves a media URL returned by the backend. Uploaded images are served
 * through our own /api/media/:fileId proxy (a backend-relative path, e.g.
 * "/api/media/abc123") rather than Google's public Drive thumbnail link —
 * that link is reliable for the account that uploaded it, but for public
 * visitors it can take anywhere from minutes to over an hour to propagate
 * after upload, and sometimes never reliably serves at all. Proxying
 * through our own authenticated backend call sidesteps that entirely.
 * Falls through unchanged for any already-absolute URL (old records,
 * external links) so this is safe to apply everywhere unconditionally.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  return url.startsWith('/') ? `${API_URL}${url}` : url;
}

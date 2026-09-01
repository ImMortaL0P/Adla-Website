import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prefixes a root-relative public-asset path (e.g. "/images/x.jpg") with
 * Vite's configured base path, so static images still resolve correctly
 * when the site is deployed under a subdirectory (e.g. GitHub Pages'
 * "/Adla-Website/"). Hardcoded "/..." strings in JS bypass Vite's
 * automatic base-rewriting, which only applies to index.html and
 * import-referenced assets — this covers the gap.
 */
export function withBase(assetPath: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + assetPath.replace(/^\//, '')
}

/**
 * Picks the correct bilingual field based on the active language.
 * Falls back to the other language rather than returning empty.
 */
export function pick<T extends object>(row: T, field: string, lang: 'en' | 'hi'): string {
  const record = row as Record<string, unknown>
  const primary = record[`${field}_${lang}`]
  const fallback = record[`${field}_${lang === 'en' ? 'hi' : 'en'}`]
  const value = (primary as string) || (fallback as string) || ''
  return value
}

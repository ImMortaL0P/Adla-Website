import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

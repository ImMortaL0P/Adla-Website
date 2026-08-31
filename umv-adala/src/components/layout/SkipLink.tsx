import { cn } from '@/lib/utils'

/**
 * Skip-to-content link — the first focusable element in the DOM.
 * Visually hidden until focused, then slides into view.
 * Anchors to #main so keyboard users can bypass the header.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        'fixed top-0 left-1/2 z-[100] -translate-x-1/2 -translate-y-full',
        'rounded-b-lg px-6 py-3 text-sm font-semibold',
        'bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))]',
        'transition-transform duration-200 ease-out',
        'focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2'
      )}
    >
      Skip to content
    </a>
  )
}

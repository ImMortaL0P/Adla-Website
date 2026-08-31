import { ArrowUp } from 'lucide-react'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useT } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export function BackToTop() {
  const scrollY = useScrollPosition()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { t } = useT()
  const visible = scrollY > 600

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })}
      aria-label={t('common.backToTop')}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full',
        'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-md',
        'transition-all duration-300 hover:bg-[hsl(var(--muted))]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <ArrowUp size={18} strokeWidth={2} />
    </button>
  )
}

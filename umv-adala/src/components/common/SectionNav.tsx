import { useScrollSpy } from '@/hooks/useScrollSpy'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

export interface SectionNavItem {
  id: string
  label: string
}

interface SectionNavProps {
  items: SectionNavItem[]
  className?: string
}

/** Sticky pill nav that highlights the in-view section (scroll-spy) and smooth-scrolls to it on click. */
export function SectionNav({ items, className }: SectionNavProps) {
  const activeId = useScrollSpy(items.map((i) => i.id))
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        'sticky top-16 z-30 -mx-5 mb-10 overflow-x-auto border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/0.9 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8',
        className
      )}
    >
      <ul className="flex w-max min-w-full items-center gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={cn(
                'whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                activeId === item.id
                  ? 'border-[hsl(var(--primary-strong))] bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

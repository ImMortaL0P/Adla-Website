import { type ElementType } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/motion/Reveal'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface SectionHeadingProps {
  overline?: string
  title: string
  description?: string
  alignment?: 'left' | 'center'
  level?: 1 | 2 | 3 | 4
  className?: string
  /** Continuous gradient sweep across the title text. Use sparingly — one showcase section, not every heading. */
  shimmer?: boolean
}

export function SectionHeading({
  overline,
  title,
  description,
  alignment = 'center',
  level = 2,
  className,
  shimmer = false,
}: SectionHeadingProps) {
  const Component = `h${level}` as ElementType
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <Reveal>
      <div
        className={cn(
          'mb-12 flex flex-col',
          alignment === 'center' ? 'items-center text-center' : 'items-start text-left',
          className
        )}
      >
        {overline && (
          <span className="mb-2 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary-strong))]">
            {overline}
          </span>
        )}
        <Component
          className={cn(
            'font-display text-3xl font-bold tracking-tight sm:text-4xl',
            shimmer && !prefersReducedMotion ? 'title-shimmer-ink' : 'text-[hsl(var(--foreground))]'
          )}
        >
          {title}
        </Component>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  )
}

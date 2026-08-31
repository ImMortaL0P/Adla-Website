import { cn } from '@/lib/utils'

interface PlaceholderImageProps {
  initials: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'saffron' | 'leaf' | 'sky' | 'clay'
  className?: string
}

const variants = {
  saffron: 'bg-[hsl(var(--saffron))/15] text-[hsl(var(--primary-strong))] border-[hsl(var(--saffron))/30]',
  leaf: 'bg-[hsl(var(--leaf))/15] text-[hsl(var(--secondary-strong))] border-[hsl(var(--leaf))/30]',
  sky: 'bg-[hsl(var(--sky))/15] text-[hsl(var(--accent-strong))] border-[hsl(var(--sky))/30]',
  clay: 'bg-[hsl(var(--clay))/15] text-[hsl(var(--clay-strong))] border-[hsl(var(--clay))/30]',
}

const sizes = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-2xl',
  xl: 'w-full aspect-[4/3] text-4xl', // Used for gallery placeholders
}

/**
 * Solid-colour tile with initials.
 * Project rule: NO fabricated content. Placeholders must be obvious.
 */
export function PlaceholderImage({
  initials,
  size = 'md',
  variant = 'saffron',
  className,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl border',
        'font-medium uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

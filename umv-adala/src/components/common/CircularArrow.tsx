import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CircularArrowProps {
  icon?: LucideIcon
  size?: 'sm' | 'md'
  className?: string
}

/**
 * A bordered circular arrow badge — pairs with a text link/CTA to give it
 * a more editorial, tactile feel than a bare inline icon. Fills solid on
 * hover/focus via the `group` pattern on the parent link.
 */
export function CircularArrow({ icon: Icon = ArrowRight, size = 'sm', className }: CircularArrowProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-current transition-all duration-200',
        'group-hover:bg-[hsl(var(--primary-strong))] group-hover:text-[hsl(var(--primary-foreground))] group-hover:border-[hsl(var(--primary-strong))] group-hover:translate-x-0.5',
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
        className
      )}
    >
      <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />
    </span>
  )
}

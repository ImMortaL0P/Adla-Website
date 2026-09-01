import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 p-8 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--card))] shadow-sm">
        <Icon size={24} className="text-[hsl(var(--muted-foreground))]" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-[hsl(var(--foreground))]">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}

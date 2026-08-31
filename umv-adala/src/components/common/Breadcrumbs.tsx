import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/** items should NOT include Home — it is always prepended. The last item should omit `href` (current page). */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { t } = useT()

  return (
    <nav aria-label={t('common.breadcrumb')} className={cn('mb-8 overflow-x-auto', className)}>
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-sm text-[hsl(var(--muted-foreground))]">
        <li className="flex items-center gap-1.5">
          <Link
            to="/"
            aria-label={t('common.nav.home')}
            className="flex items-center hover:text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
          >
            <Home size={14} />
          </Link>
          <ChevronRight size={14} className="shrink-0 text-[hsl(var(--border))]" aria-hidden="true" />
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <>
                <Link
                  to={item.href}
                  className="hover:text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
                >
                  {item.label}
                </Link>
                <ChevronRight size={14} className="shrink-0 text-[hsl(var(--border))]" aria-hidden="true" />
              </>
            ) : (
              <span aria-current="page" className="max-w-[200px] truncate font-medium text-[hsl(var(--foreground))] sm:max-w-xs">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

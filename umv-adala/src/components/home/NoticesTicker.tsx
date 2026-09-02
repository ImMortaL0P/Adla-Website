import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Marquee } from '@/components/motion/Marquee'
import { staticNotices } from '@/data/notices'
import { useNotices } from '@/hooks/useNotices'
import { pick, cn } from '@/lib/utils'

const typeStyles: Record<string, string> = {
  circular: 'bg-[hsl(var(--sky))]/15 text-[hsl(var(--accent-strong))]',
  notice: 'bg-[hsl(var(--saffron))]/15 text-[hsl(var(--primary-strong))]',
  event: 'bg-[hsl(var(--leaf))]/15 text-[hsl(var(--secondary-strong))]',
  holiday: 'bg-[hsl(var(--clay))]/15 text-[hsl(var(--clay-strong))]',
  result: 'bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive-strong))]',
}

export function NoticesTicker() {
  const { t, lang } = useT()
  const { notices } = useNotices()
  const source = notices.length > 0 ? notices : staticNotices
  const filteredNotices = [...source]
    .filter((n) => n.is_published)
    .sort((a, b) => new Date(b.published_at || b.created_at || Date.now()).getTime() - new Date(a.published_at || a.created_at || Date.now()).getTime())

  if (filteredNotices.length === 0) return null

  return (
    <div className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="mx-auto flex max-w-7xl items-stretch">
        <Link
          to="/notices"
          className="flex shrink-0 items-center gap-2 border-r border-[hsl(var(--border))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        >
          <Bell size={16} />
          <span className="hidden sm:inline">{t('common.nav.notices')}</span>
        </Link>
        <Marquee speed={35} className="py-3">
          {filteredNotices.map((notice) => (
            <Link
              key={notice.id}
              to={`/notices/${notice.slug}`}
              className="mx-6 flex shrink-0 items-center gap-3 text-sm text-[hsl(var(--foreground))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            >
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', typeStyles[notice.type])}>
                {t(`notices.filter.${notice.type}` as any)}
              </span>
              {pick(notice, 'title', lang)}
            </Link>
          ))}
        </Marquee>
      </div>
    </div>
  )
}

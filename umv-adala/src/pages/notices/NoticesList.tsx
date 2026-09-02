import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Paperclip } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { EmptyState } from '@/components/common/EmptyState'
import { useNotices } from '@/hooks/useNotices'
import { staticNotices } from '@/data/notices'
import { pick, cn } from '@/lib/utils'
import type { NoticeType } from '@/types/domain'

const filters: Array<{ value: NoticeType | 'all'; labelKey: string }> = [
  { value: 'all', labelKey: 'notices.filter.all' },
  { value: 'circular', labelKey: 'notices.filter.circular' },
  { value: 'notice', labelKey: 'notices.filter.notice' },
  { value: 'event', labelKey: 'notices.filter.event' },
  { value: 'holiday', labelKey: 'notices.filter.holiday' },
  { value: 'result', labelKey: 'notices.filter.result' },
]

const typeStyles: Record<string, string> = {
  circular: 'bg-[hsl(var(--sky))]/15 text-[hsl(var(--accent-strong))]',
  notice: 'bg-[hsl(var(--saffron))]/15 text-[hsl(var(--primary-strong))]',
  event: 'bg-[hsl(var(--leaf))]/15 text-[hsl(var(--secondary-strong))]',
  holiday: 'bg-[hsl(var(--clay))]/15 text-[hsl(var(--clay-strong))]',
  result: 'bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive-strong))]',
}

function formatDate(iso: string, lang: 'en' | 'hi') {
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isNew(iso: string) {
  return Date.now() - new Date(iso).getTime() < 14 * 24 * 60 * 60 * 1000
}

export default function NoticesList() {
  const { t, lang } = useT()
  const [activeFilter, setActiveFilter] = useState<NoticeType | 'all'>('all')
  const { notices } = useNotices()

  const filtered = useMemo(() => {
    // Fallback to staticNotices if API fails to load anything initially (optional, you can drop staticNotices entirely)
    const source = notices.length > 0 ? notices : staticNotices;
    const published = [...source]
      .filter((n) => n.is_published)
      .sort((a, b) => new Date(b.published_at || b.created_at || Date.now()).getTime() - new Date(a.published_at || a.created_at || Date.now()).getTime())
    return activeFilter === 'all' ? published : published.filter((n) => n.type === activeFilter)
  }, [activeFilter, notices])

  return (
    <>
      <Seo titleKey="notices.title" path="/notices" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('notices.overline')} title={t('notices.title')} level={1} />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              aria-pressed={activeFilter === f.value}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                activeFilter === f.value
                  ? 'border-[hsl(var(--primary-strong))] bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              {t(f.labelKey as any)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Bell} title={t('notices.empty')} description="" />
        ) : (
          <ul className="flex flex-col gap-4">
            {filtered.map((notice, i) => (
              <Reveal key={notice.id} as="li" delay={Math.min(i * 60, 400)}>
                <Link
                  to={`/notices/${notice.slug}`}
                  className="flex flex-col gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 transition-colors hover:bg-[hsl(var(--muted))]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className={cn('mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', typeStyles[notice.type])}>
                      {t(`notices.filter.${notice.type}` as any)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium text-[hsl(var(--foreground))]">{pick(notice, 'title', lang)}</h2>
                        {isNew(notice.published_at) && (
                          <span className="rounded-full bg-[hsl(var(--destructive-strong))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            {t('notices.new')}
                          </span>
                        )}
                        {notice.attachment_url && <Paperclip size={13} className="text-[hsl(var(--muted-foreground))]" />}
                      </div>
                    </div>
                  </div>
                  <time dateTime={notice.published_at} className="shrink-0 text-sm text-[hsl(var(--muted-foreground))]">
                    {formatDate(notice.published_at, lang)}
                  </time>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

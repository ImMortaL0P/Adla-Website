import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BellOff } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { EmptyState } from '@/components/common/EmptyState'
import { staticNotices } from '@/data/notices'
import { pick, cn } from '@/lib/utils'

const typeStyles: Record<string, string> = {
  circular: 'bg-[hsl(var(--sky))]/15 text-[hsl(var(--accent-strong))]',
  notice: 'bg-[hsl(var(--saffron))]/15 text-[hsl(var(--primary-strong))]',
  event: 'bg-[hsl(var(--leaf))]/15 text-[hsl(var(--secondary-strong))]',
  holiday: 'bg-[hsl(var(--clay))]/15 text-[hsl(var(--clay-strong))]',
  result: 'bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive-strong))]',
}

export default function NoticeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useT()
  const notice = staticNotices.find((n) => n.slug === slug && n.is_published)

  if (!notice) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-12">
        <EmptyState icon={BellOff} title={t('notices.notFound')} description="" />
        <div className="mt-6 text-center">
          <Link to="/notices" className="text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline">
            {t('notices.backToNotices')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo titleString={pick(notice, 'title', lang)} path={`/notices/${notice.slug}`} />
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: t('notices.title'), href: '/notices' }, { label: pick(notice, 'title', lang) }]} />
        <Link
          to="/notices"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
        >
          <ArrowLeft size={16} />
          {t('notices.backToNotices')}
        </Link>

        <Reveal>
          <span className={cn('mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize', typeStyles[notice.type])}>
            {t(`notices.filter.${notice.type}` as any)}
          </span>
          <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            {pick(notice, 'title', lang)}
          </h1>
          <p className="mb-8 text-sm text-[hsl(var(--muted-foreground))]">
            {t('notices.publishedOn')}{' '}
            <time dateTime={notice.published_at}>
              {new Date(notice.published_at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </p>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <p className="leading-relaxed text-[hsl(var(--foreground))]">{pick(notice, 'body', lang)}</p>
          </div>
        </Reveal>
      </div>
    </>
  )
}

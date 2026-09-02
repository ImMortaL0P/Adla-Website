import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ArrowLeft, BellOff, Download, ExternalLink } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { EmptyState } from '@/components/common/EmptyState'
import { PdfViewer } from '@/components/notices/PdfViewer'
import { staticNotices } from '@/data/notices'
import { useNotices } from '@/hooks/useNotices'
import { pick, cn } from '@/lib/utils'
import { getNoticeAttachmentUrls, getPdfEmbedUrl, isPdfAttachment } from '@/lib/notices'

const typeStyles: Record<string, string> = {
  circular: 'bg-[hsl(var(--sky))]/15 text-[hsl(var(--accent-strong))]',
  notice: 'bg-[hsl(var(--saffron))]/15 text-[hsl(var(--primary-strong))]',
  order: 'bg-[hsl(var(--leaf))]/15 text-[hsl(var(--secondary-strong))]',
  tender: 'bg-[hsl(var(--clay))]/15 text-[hsl(var(--clay-strong))]',
  event: 'bg-[hsl(var(--leaf))]/15 text-[hsl(var(--secondary-strong))]',
  holiday: 'bg-[hsl(var(--clay))]/15 text-[hsl(var(--clay-strong))]',
  result: 'bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive-strong))]',
}

export default function NoticeDetail() {
  const { slug } = useParams()
  const { t, lang } = useT()
  const { notices, loading } = useNotices()

  const notice = useMemo(() => {
    const source = notices.length > 0 ? notices : staticNotices
    return source.find((n) => n.slug === slug)
  }, [slug, notices])

  if (loading) {
    return <div className="p-12 text-center text-[hsl(var(--muted-foreground))]">Loading...</div>
  }

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

  const { viewUrl, downloadUrl } = getNoticeAttachmentUrls(notice)
  const embedUrl = viewUrl ? getPdfEmbedUrl(notice) : null
  const showPdf = Boolean(embedUrl && isPdfAttachment(notice))
  const body = pick(notice, 'body', lang)
  const title = pick(notice, 'title', lang)

  return (
    <>
      <Seo titleString={title} path={`/notices/${notice.slug}`} />
      <div className={cn('mx-auto px-5 py-16 sm:px-8 lg:px-12', showPdf ? 'max-w-5xl' : 'max-w-3xl')}>
        <Breadcrumbs items={[{ label: t('notices.title'), href: '/notices' }, { label: title }]} />
        <Link
          to="/notices"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
        >
          <ArrowLeft size={16} />
          {t('notices.backToNotices')}
        </Link>

        <Reveal>
          <span className={cn('mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize', typeStyles[notice.type])}>
            {t(`notices.filter.${notice.type}` as any) || notice.type}
          </span>
          <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            {title}
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

          {body && (
            <div className="mb-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <p className="whitespace-pre-line leading-relaxed text-[hsl(var(--foreground))]">{body}</p>
            </div>
          )}

          {showPdf && embedUrl && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">{t('notices.document')}</h2>
              <PdfViewer src={embedUrl} title={title} />
            </div>
          )}

          {viewUrl && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={downloadUrl || viewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary-strong))] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
              >
                <Download size={16} />
                {t('notices.download')}
              </a>
              <a
                href={viewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
              >
                <ExternalLink size={16} />
                {t('notices.viewOnDrive')}
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </>
  )
}

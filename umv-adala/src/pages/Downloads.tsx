import { useMemo } from 'react'
import { FileText, Download as DownloadIcon } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { EmptyState } from '@/components/common/EmptyState'
import { Reveal } from '@/components/motion/Reveal'
import { useNotices } from '@/hooks/useNotices'
import { staticNotices } from '@/data/notices'
import { pick } from '@/lib/utils'
import { getNoticeAttachmentUrls } from '@/lib/notices'
import type { Notice } from '@/types/domain'

function DownloadsTable({ items, title, t, lang }: { items: Notice[], title: string, t: any, lang: 'en' | 'hi' }) {
  return (
    <div className="mb-12 last:mb-0">
      <h2 className="mb-6 font-display text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h2>
      {items.length === 0 ? (
        <EmptyState icon={FileText} title={title} description={t('downloads.comingSoon')} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[hsl(var(--muted))]/50 border-b border-[hsl(var(--border))]">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold text-[hsl(var(--foreground))] w-10">
                  {t('downloads.sno' as any) || 'S.No.'}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-[hsl(var(--foreground))]">
                  {t('downloads.titleHeader' as any) || 'Title'}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-[hsl(var(--foreground))]">
                  {t('downloads.date' as any) || 'Date'}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-[hsl(var(--foreground))] text-right">
                  {t('downloads.action' as any) || 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] bg-[hsl(var(--card))]">
              {items.map((item, index) => {
                const { downloadUrl } = getNoticeAttachmentUrls(item)
                const date = new Date(item.published_at || item.created_at || Date.now()).toLocaleDateString(
                  lang === 'hi' ? 'hi-IN' : 'en-IN',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )

                return (
                  <Reveal as="tr" key={item.id} delay={Math.min(index * 50, 300)} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                    <td className="px-5 py-4 text-[hsl(var(--muted-foreground))]">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-medium text-[hsl(var(--foreground))]">
                      <div className="flex items-center gap-2">
                        <span>{pick(item, 'title', lang)}</span>
                        {item.category && (
                          <span className="inline-flex items-center rounded-full bg-[hsl(var(--primary-strong))]/10 px-2 py-0.5 text-xs font-semibold text-[hsl(var(--primary-strong))]">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                      {date}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={downloadUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary-strong))]/10 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--primary-strong))] hover:bg-[hsl(var(--primary-strong))]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                      >
                        <DownloadIcon size={14} />
                        <span className="hidden sm:inline">{t('notices.download')}</span>
                        <span className="sm:hidden">PDF</span>
                      </a>
                    </td>
                  </Reveal>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function Downloads() {
  const { t, lang } = useT()
  const { notices } = useNotices()

  const { routines, others } = useMemo(() => {
    const source = notices.length > 0 ? notices : staticNotices;
    const allDownloads = [...source]
      .filter((n) => n.is_published && (n.attachment_url || n.driveFileId || n.attachment_download_url))
      .sort((a, b) => new Date(b.published_at || b.created_at || Date.now()).getTime() - new Date(a.published_at || a.created_at || Date.now()).getTime())

    const isRoutine = (n: Notice) => {
       if (n.type === 'routine') return true;
       const title = ((n.title_en || '') + ' ' + (n.title_hi || '')).toLowerCase();
       return title.includes('routine') || title.includes('timetable') || title.includes('time table') || title.includes('समय सारणी') || title.includes('रूटीन')
    }

    return {
      routines: allDownloads.filter(isRoutine),
      others: allDownloads.filter(n => !isRoutine(n))
    }
  }, [notices])

  return (
    <>
      <Seo titleKey="downloads.title" path="/downloads" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('downloads.overline')} title={t('downloads.title')} level={1} />

        <div className="flex flex-col mt-4">
          <DownloadsTable items={routines} title={t('downloads.routines' as any)} t={t} lang={lang} />
          <DownloadsTable items={others} title={t('downloads.others' as any)} t={t} lang={lang} />
        </div>
      </div>
    </>
  )
}

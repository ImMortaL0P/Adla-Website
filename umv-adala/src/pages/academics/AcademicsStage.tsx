import { useState } from 'react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { academicsData } from '@/data/academics'
import { cn } from '@/lib/utils'

type StageKey = 'primary' | 'middle' | 'secondary' | 'senior'

const titleKeys: Record<StageKey, string> = {
  primary: 'academics.primary.title',
  middle: 'academics.middle.title',
  secondary: 'academics.secondary.title',
  senior: 'academics.senior.title',
}

const overlineKeys: Record<StageKey, string> = {
  primary: 'common.nav.primary',
  middle: 'common.nav.middle',
  secondary: 'common.nav.secondary',
  senior: 'common.nav.senior',
}

const streamKeys = ['science', 'commerce', 'arts'] as const

const stageCodes: Partial<Record<StageKey, string>> = {
  secondary: 'School Code: 71485',
  senior: 'School Code: 17355',
}

export function AcademicsStage({ stage }: { stage: StageKey }) {
  const { t, lang } = useT()
  const [activeStream, setActiveStream] = useState<(typeof streamKeys)[number]>('science')

  const data = academicsData[stage]
  const isSenior = stage === 'senior'

  return (
    <>
      <Seo titleKey={titleKeys[stage]} path={`/academics/${stage === 'primary' ? 'primary' : stage}`} />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: t('academics.title'), href: '/academics' }, { label: t(titleKeys[stage] as any) }]} />
        
        <Reveal>
          <div className="mb-12 flex flex-col items-start text-left">
            <span className="mb-2 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary-strong))]">
              {t(overlineKeys[stage] as any)}
            </span>
            <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                {t(titleKeys[stage] as any)}
              </h1>
              {stageCodes[stage] && (
                <div className="inline-flex shrink-0 items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-1 text-sm font-semibold tracking-wide text-[hsl(var(--muted-foreground))]">
                  {stageCodes[stage]}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {isSenior ? (
          <Reveal>
            <section className="mb-10">
              <h2 className="mb-4 font-semibold text-[hsl(var(--foreground))]">{t('academics.senior.streams')}</h2>
              <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label={t('academics.senior.streams')}>
                {streamKeys.map((stream) => (
                  <button
                    key={stream}
                    role="tab"
                    aria-selected={activeStream === stream}
                    onClick={() => setActiveStream(stream)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                      activeStream === stream
                        ? 'border-[hsl(var(--primary-strong))] bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                    )}
                  >
                    {t(`academics.senior.${stream}` as any)}
                  </button>
                ))}
              </div>
              <div role="tabpanel" className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <h3 className="mb-3 font-semibold text-[hsl(var(--foreground))]">{t('academics.subjects')}</h3>
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">{t(`academics.senior.${activeStream}` as any)} {t('academics.subjects')}</caption>
                  <tbody>
                    {academicsData.senior.streams[activeStream][lang].map((subject) => (
                      <tr key={subject} className="border-b border-[hsl(var(--border))] last:border-0">
                        <td className="py-2 text-[hsl(var(--muted-foreground))]">{subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </Reveal>
        ) : (
          <Reveal>
            <section className="mb-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h2 className="mb-3 font-semibold text-[hsl(var(--foreground))]">{t('academics.subjects')}</h2>
              <table className="w-full text-left text-sm">
                <caption className="sr-only">{t(titleKeys[stage] as any)} {t('academics.subjects')}</caption>
                <tbody>
                  {'subjects' in data &&
                    data.subjects[lang].map((subject) => (
                      <tr key={subject} className="border-b border-[hsl(var(--border))] last:border-0">
                        <td className="py-2 text-[hsl(var(--muted-foreground))]">{subject}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
          </Reveal>
        )}

        <Reveal>
          <section className="mb-10">
            <h2 className="mb-2 font-semibold text-[hsl(var(--foreground))]">{t('academics.assessment')}</h2>
            <p className="text-[hsl(var(--muted-foreground))]">{data.assessment[lang]}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 p-6">
            <h2 className="mb-2 font-semibold text-[hsl(var(--foreground))]">{t('academics.periods')}</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('academics.periodsNote')}</p>
          </section>
        </Reveal>
      </div>
    </>
  )
}

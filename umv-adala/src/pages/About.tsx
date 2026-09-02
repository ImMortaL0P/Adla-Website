import { Link } from 'react-router-dom'
import { Target, Compass, Clock, Landmark, ScrollText } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { school } from '@/data/school'
import { aboutContent } from '@/data/content'
import { useImages } from '@/hooks/useImages'

export default function About() {
  const { t, lang } = useT()
  const { getSystemImage } = useImages()

  const aboutBg = getSystemImage('about_bg')

  const infoCards = [
    { icon: Compass, title: t('about.vision'), body: t('about.visionText') },
    { icon: Target, title: t('about.mission'), body: t('about.missionText') },
    { icon: Clock, title: t('about.timings'), body: t('about.timingsText') },
    { icon: Landmark, title: t('about.affiliation'), body: t('about.affiliationText') },
  ]

  return (
    <>
      <Seo titleKey="about.title" path="/about" />
      {aboutBg && (
        <div className="relative h-64 w-full md:h-80 lg:h-96">
          <img src={aboutBg} alt="About School" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('about.overline')} title={t('about.title')} alignment="left" level={1} />

        <Reveal>
          <section className="mb-14">
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-[hsl(var(--foreground))]">
              <ScrollText size={20} className="text-[hsl(var(--primary-strong))]" />
              {t('about.history')}
            </h2>
            <p className="leading-relaxed text-[hsl(var(--muted-foreground))]">{aboutContent.history[lang]}</p>
          </section>
        </Reveal>

        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {infoCards.map((card) => (
            <Reveal key={card.title}>
              <div className="h-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <card.icon size={22} className="mb-3 text-[hsl(var(--primary-strong))]" />
                <h3 className="mb-2 font-semibold text-[hsl(var(--foreground))]">{card.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <section className="mb-14">
            <h2 className="mb-3 font-display text-xl font-semibold text-[hsl(var(--foreground))]">
              {t('about.management')}
            </h2>
            <p className="leading-relaxed text-[hsl(var(--muted-foreground))]">{aboutContent.management[lang]}</p>
            <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
              {school.managedBy[lang]}
            </p>
          </section>
        </Reveal>

        {aboutContent.milestones.length > 0 && (
          <section>
            <h2 className="mb-8 font-display text-xl font-semibold text-[hsl(var(--foreground))]">
              {t('about.timeline')}
            </h2>
            <ol className="relative border-l border-[hsl(var(--border))] pl-6 sm:pl-8">
              {aboutContent.milestones.map((m, i) => (
                <Reveal key={i} as="li" className="relative mb-10 last:mb-0">
                  <span className="absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary-strong))] sm:-left-[calc(2rem+5px)]" />
                  <span className="mb-1 block text-sm font-semibold uppercase tracking-wide text-[hsl(var(--primary-strong))]">
                    {m.year}
                  </span>
                  <h3 className="mb-1 font-semibold text-[hsl(var(--foreground))]">
                    {lang === 'en' ? m.title_en : m.title_hi}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {lang === 'en' ? m.desc_en : m.desc_hi}
                  </p>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            to="/about/headMaster"
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          >
            {t('common.nav.headMaster')}
          </Link>
          <Link
            to="/about/infrastructure"
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          >
            {t('common.nav.infrastructure')}
          </Link>
        </div>
      </div>
    </>
  )
}

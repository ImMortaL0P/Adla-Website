import { Link } from 'react-router-dom'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { ScrollRevealText } from '@/components/motion/ScrollRevealText'
import { StockPhoto } from '@/components/common/StockPhoto'
import { CircularArrow } from '@/components/common/CircularArrow'
import { aboutContent } from '@/data/content'
import { stockPhotos } from '@/data/stockPhotos'

export function AboutPreview() {
  const { t, lang } = useT()

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="left">
          <StockPhoto photo={stockPhotos.campusVillageSchool} className="aspect-[4/3] w-full" />
        </Reveal>
        <Reveal direction="right">
          <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary-strong))]">
            {t('home.about.overline')}
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
            {t('home.about.title')}
          </h2>
          <p className="mb-4 text-lg text-[hsl(var(--muted-foreground))]">{t('home.about.description')}</p>
          <ScrollRevealText text={aboutContent.history[lang]} className="mb-6 text-[hsl(var(--muted-foreground))]" />
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 font-medium text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
          >
            {t('home.about.readMore')}
            <CircularArrow />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

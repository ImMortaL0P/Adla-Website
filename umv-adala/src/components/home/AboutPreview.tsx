import { ProtectedImage } from "@/components/common/ProtectedImage"
import { Link } from 'react-router-dom'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { ScrollRevealText } from '@/components/motion/ScrollRevealText'
import { CircularArrow } from '@/components/common/CircularArrow'
import { aboutContent } from '@/data/content'
import { useImages } from '@/hooks/useImages'

export function AboutPreview() {
  const { t, lang } = useT()
  const { getSystemImage } = useImages()

  const dynamicAboutImg = getSystemImage('about image') || getSystemImage('about_bg') || ''

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="left">
          {dynamicAboutImg ? (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <ProtectedImage src={dynamicAboutImg} alt="About School" containerClassName="h-full w-full" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          ) : (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 animate-pulse" />
          )}
        </Reveal>
        <Reveal direction="right">
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

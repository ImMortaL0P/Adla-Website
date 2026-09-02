import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { AnimatedTitle } from '@/components/common/AnimatedTitle'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useImages } from '@/hooks/useImages'
import { stockPhotos } from '@/data/stockPhotos'
import { cn } from '@/lib/utils'

export function HomeHero() {
  const { t, lang } = useT()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { images, getSystemImage, loading } = useImages()

  const dynamicHero = getSystemImage('hero_bg')
  console.log('HomeHero -> loading:', loading, 'images count:', images.length, 'dynamicHero:', dynamicHero)

  const heroImage = dynamicHero || stockPhotos.campusEntrance.src
  const bgPhoto = stockPhotos.campusEntrance // fallback for credit text if needed

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background photo + gradient overlay — modern full-bleed hero treatment */}
      <div className="absolute inset-0 -z-20">
        <img src={heroImage} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,8%)]/55 via-[hsl(220,25%,8%)]/65 to-[hsl(220,25%,8%)]/90" />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage: `
              radial-gradient(at 15% 20%, hsla(var(--sky) / 0.55) 0px, transparent 55%),
              radial-gradient(at 85% 15%, hsla(var(--saffron) / 0.5) 0px, transparent 55%),
              radial-gradient(at 90% 90%, hsla(var(--leaf) / 0.45) 0px, transparent 55%)
            `,
          }}
        />
        <span className="sr-only">{bgPhoto.alt[lang]}</span>
      </div>

      {/* Illustrative-photo disclosure badge */}
      <div
        title={`${t('common.illustrativePhoto')} — ${t('common.photoCredit')}: ${bgPhoto.credit}`}
        className="absolute bottom-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm"
      >
        {t('common.illustrativePhoto')}
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 text-center sm:px-8 lg:px-12">
        <StaggerGroup stagger={100} className="flex max-w-4xl flex-col items-center">

          <Reveal>
            <div className="mb-4 inline-flex flex-wrap justify-center gap-3">
              <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                {t('common.govAttribution')}
              </div>
              <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                UDISE: 10280606804
              </div>
              <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                Cluster MS Adla
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <AnimatedTitle
                text={t('home.hero.title')}
                as="span"
                className={cn('block', lang === 'hi' && 'mb-2')}
                wordClassName={!prefersReducedMotion ? 'title-shimmer' : undefined}
              />
              {lang === 'en' && (
                <AnimatedTitle
                  text={t('home.hero.titleHi')}
                  as="span"
                  className="font-jaini mt-2 block text-3xl font-normal text-white/80 sm:text-4xl md:text-5xl"
                  startDelay={250}
                />
              )}
            </h1>
          </Reveal>

          <Reveal>
            <p className="mb-10 mt-2 max-w-2xl text-lg text-white/85 sm:text-xl">
              {t('home.hero.subtitle')}
            </p>
          </Reveal>

          <Reveal>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
              <Link
                to="/admission"
                className={cn(
                  'group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-medium',
                  'bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))] shadow-lg shadow-black/20',
                  'transition-all hover:bg-[hsl(var(--primary-strong))]/90 hover:shadow-xl active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                  'sm:w-auto'
                )}
              >
                {t('home.hero.ctaAdmission')}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/academics"
                className={cn(
                  'group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-medium',
                  'border border-white/30 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md',
                  'transition-all hover:bg-white/20 active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                  'sm:w-auto'
                )}
              >
                <BookOpen size={18} className="text-white/80" />
                {t('home.hero.ctaAcademics')}
              </Link>
            </div>
          </Reveal>

        </StaggerGroup>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs font-medium uppercase tracking-widest">{t('home.hero.scrollCue')}</span>
          <div className="h-6 w-[1px] bg-white/40" />
        </div>
      </div>
    </section>
  )
}

import { ProtectedImage } from "@/components/common/ProtectedImage"
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { AnimatedTitle } from '@/components/common/AnimatedTitle'
import { useImages } from '@/hooks/useImages'
import { cn } from '@/lib/utils'

export function HomeHero() {
  const { t, lang } = useT()
  const { getSystemImage } = useImages()

  // New keys based on client uploads.
  const dynamicHero = getSystemImage('main bg image') || getSystemImage('hero_bg')
  const heroImage = dynamicHero || '' // Fallback to empty string if not loaded yet


  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background photo + gradient overlay — modern full-bleed hero treatment */}
      <div className="absolute inset-0 -z-20">
        <ProtectedImage src={heroImage} alt="" aria-hidden="true" containerClassName="h-full w-full" className="h-full w-full object-cover" loading="eager" />
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
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 text-center sm:px-8 lg:px-12">
        <StaggerGroup stagger={100} className="flex max-w-4xl flex-col items-center gap-6 sm:gap-8">

          <Reveal>
            <div className="flex flex-col items-center mb-2">
              <span className="mb-4 text-sm font-bold tracking-widest text-white/90 uppercase sm:text-base md:text-lg">
                ESTD. - 2020
              </span>
              <h1 className="max-w-[800px] font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl px-2">
                <AnimatedTitle
                  text={t('home.hero.title')}
                  as="span"
                  className={cn('block mx-auto w-full break-words', lang === 'hi' && 'mb-2')}
                />
                {lang === 'en' && (
                  <div className="pt-3 sm:pt-6">
                    <AnimatedTitle
                      text={t('home.hero.titleHi')}
                      as="span"
                      className="font-jaini mt-2 block text-xl font-medium text-white/80 sm:text-3xl md:text-4xl mx-auto w-full break-words"
                      startDelay={250}
                    />
                  </div>
                )}
              </h1>
            </div>
          </Reveal>

          <Reveal>
            <div className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-md">
              UDISE: 10280606804
            </div>
          </Reveal>

          <Reveal>
            <p className="max-w-2xl px-4 text-base text-white/85 sm:text-lg md:text-xl">
              {t('home.hero.subtitle')}
            </p>
          </Reveal>

          <Reveal>
            <div className="flex w-full max-w-[280px] flex-col items-center justify-center gap-3 px-2 sm:max-w-none sm:w-auto sm:flex-row mt-2">
              <Link
                to="/admission"
                className={cn(
                  'group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base font-medium',
                  'bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))] shadow-lg shadow-black/20',
                  'transition-all hover:bg-[hsl(var(--primary-strong))]/90 hover:shadow-xl active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                  'sm:w-auto'
                )}
              >
                {t('home.hero.ctaAdmission')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]" />
              </Link>

              <Link
                to="/academics"
                className={cn(
                  'group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base font-medium',
                  'border border-white/30 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md',
                  'transition-all hover:bg-white/20 active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                  'sm:w-auto'
                )}
              >
                <BookOpen size={16} className="text-white/80 sm:h-[18px] sm:w-[18px]" />
                {t('home.hero.ctaAcademics')}
              </Link>
            </div>
          </Reveal>

        </StaggerGroup>
      </div>
    </section>
  )
}

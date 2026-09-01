import { useT } from '@/context/LanguageContext'
import { Marquee } from '@/components/motion/Marquee'
import { SchoolLogo } from '@/components/common/SchoolLogo'
import { Reveal } from '@/components/motion/Reveal'

const BAND_REPEATS = 6

/**
 * A full-width text band carrying the school motto in a constant, gentle
 * marquee loop — not tied to scroll position. Marquee already handles
 * prefers-reduced-motion (falls back to static, non-scrolling text).
 */
export function MottoSection() {
  const { t } = useT()

  return (
    <section className="bg-grid-paper isolate relative flex flex-col items-center gap-4 overflow-hidden bg-[hsl(var(--muted))] py-8 sm:py-10">
      {/* Large faint watermark crest behind the band */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
        <SchoolLogo className="h-[420px] sm:h-[560px]" />
      </div>

      <Marquee speed={28} pauseOnHover={false} className="w-full">
        {Array.from({ length: BAND_REPEATS }, (_, i) => (
          <span
            key={i}
            aria-hidden={i > 0}
            className="font-jaini mx-6 whitespace-nowrap font-bold leading-[1.3] text-[hsl(var(--primary-strong))]/90"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            {t('common.motto')} <span className="text-[hsl(var(--accent-strong))]">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="relative flex flex-col items-center px-5 text-center sm:px-8">
        <Reveal delay={100}>
          <p className="max-w-xl text-sm text-[hsl(var(--muted-foreground))] sm:text-base">
            {t('common.mottoTranslation')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

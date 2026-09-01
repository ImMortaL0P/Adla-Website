import { useT } from '@/context/LanguageContext'
import { Marquee } from '@/components/motion/Marquee'
import { SchoolCrest } from '@/components/common/SchoolCrest'
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
    <section className="relative flex flex-col items-center gap-8 overflow-hidden bg-[hsl(var(--muted))] py-16 sm:py-20">
      <Marquee speed={60} pauseOnHover={false} className="w-full">
        {Array.from({ length: BAND_REPEATS }, (_, i) => (
          <span
            key={i}
            aria-hidden={i > 0}
            className="mx-6 whitespace-nowrap font-display font-bold leading-none text-[hsl(var(--primary-strong))]/90"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            {t('common.motto')} <span className="text-[hsl(var(--accent-strong))]">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="flex flex-col items-center px-5 text-center sm:px-8">
        <SchoolCrest size={48} className="mb-4 text-[hsl(var(--primary-strong))]" />
        <Reveal delay={100}>
          <p className="max-w-xl text-sm text-[hsl(var(--muted-foreground))] sm:text-base">
            {t('common.mottoTranslation')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

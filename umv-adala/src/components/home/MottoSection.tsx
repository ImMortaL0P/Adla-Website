import { useT } from '@/context/LanguageContext'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { SchoolCrest } from '@/components/common/SchoolCrest'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

/**
 * Scroll-triggered reveal of the school motto — a distinct animated moment
 * (crest scale-in + a line that draws itself across the page) rather than
 * the standard fade-up used elsewhere, since the motto is a one-off feature.
 */
export function MottoSection() {
  const { t } = useT()
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const active = prefersReducedMotion || isInView

  return (
    <section ref={ref} className="relative overflow-hidden bg-[hsl(var(--muted))] py-16 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
        <div
          className="mb-6 text-[hsl(var(--primary-strong))] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'scale(1) rotate(0deg)' : 'scale(0.6) rotate(-20deg)',
          }}
        >
          <SchoolCrest size={48} />
        </div>

        <Reveal delay={100}>
          <p className="font-display text-2xl font-semibold leading-relaxed text-[hsl(var(--foreground))] sm:text-3xl md:text-4xl">
            {t('common.motto')}
          </p>
        </Reveal>

        {/* Line that draws itself left-to-right once in view */}
        <div
          className="my-5 h-[2px] bg-[hsl(var(--primary-strong))] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: '96px',
            transform: active ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transitionDelay: '250ms',
          }}
        />

        <Reveal delay={300}>
          <p className={cn('max-w-xl text-sm text-[hsl(var(--muted-foreground))] sm:text-base')}>
            {t('common.mottoTranslation')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

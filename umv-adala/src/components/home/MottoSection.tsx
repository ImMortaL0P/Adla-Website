import { useEffect, useRef, useState } from 'react'
import { useT } from '@/context/LanguageContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { SchoolCrest } from '@/components/common/SchoolCrest'
import { Reveal } from '@/components/motion/Reveal'

const BAND_REPEATS = 6

/**
 * A full-width text band carrying the school motto. The section pins in
 * place (sticky) for an extended scroll range, and the band slides
 * horizontally the whole time you're scrolling through that range — so
 * the motion plays out across a long stretch of the page rather than a
 * brief pass-through, then it unpins and the page continues normally.
 * Under prefers-reduced-motion it's a normal static section instead.
 */
export function MottoSection() {
  const { t } = useT()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [translate, setTranslate] = useState(-30)

  useEffect(() => {
    if (prefersReducedMotion) return

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const el = wrapperRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const vh = window.innerHeight
          const scrollableRange = rect.height - vh
          const progress = scrollableRange > 0 ? -rect.top / scrollableRange : 0
          const clamped = Math.min(1, Math.max(0, progress))
          setTranslate((clamped - 0.5) * 60)
        }
        ticking = false
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion])

  const bandText = Array.from({ length: BAND_REPEATS }, () => t('common.motto')).join('   ✦   ')

  const content = (
    <>
      <div
        className="w-full whitespace-nowrap text-center font-display font-bold leading-none text-[hsl(var(--primary-strong))]/90"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          transform: prefersReducedMotion ? undefined : `translateX(${translate}%)`,
        }}
        aria-hidden="true"
      >
        {bandText}
      </div>

      <span className="sr-only">{t('common.motto')}</span>

      <div className="flex flex-col items-center px-5 text-center sm:px-8">
        <SchoolCrest size={48} className="mb-4 text-[hsl(var(--primary-strong))]" />
        <Reveal delay={100}>
          <p className="max-w-xl text-sm text-[hsl(var(--muted-foreground))] sm:text-base">
            {t('common.mottoTranslation')}
          </p>
        </Reveal>
      </div>
    </>
  )

  if (prefersReducedMotion) {
    return (
      <section className="relative flex flex-col items-center gap-8 overflow-hidden bg-[hsl(var(--muted))] py-16 sm:py-20">
        {content}
      </section>
    )
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: '220vh' }}>
      <section className="sticky top-0 flex h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-[hsl(var(--muted))]">
        {content}
      </section>
    </div>
  )
}

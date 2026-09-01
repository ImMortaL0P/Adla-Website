import { useEffect, useRef, useState } from 'react'
import { useT } from '@/context/LanguageContext'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { SchoolCrest } from '@/components/common/SchoolCrest'
import { Reveal } from '@/components/motion/Reveal'

const BAND_REPEATS = 6

/**
 * A full-width text band carrying the school motto, repeated edge-to-edge.
 * It sits still until scrolled into view, then its horizontal position is
 * driven directly by scroll progress through the section — scrolling down
 * drags the band left, so the motion is tied to the page, not a timer.
 */
export function MottoSection() {
  const { t } = useT()
  const sectionRef = useRef<HTMLElement>(null)
  const [inViewRef, isInView] = useInView({ threshold: 0, rootMargin: '10% 0px 10% 0px', triggerOnce: false })
  const prefersReducedMotion = usePrefersReducedMotion()
  const [translate, setTranslate] = useState(0)

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node
    inViewRef(node)
  }

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const el = sectionRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const vh = window.innerHeight
          // 0 when the section's top is at the viewport bottom, 1 when its bottom is at the viewport top.
          const progress = (vh - rect.top) / (vh + rect.height)
          const clamped = Math.min(1, Math.max(0, progress))
          setTranslate((clamped - 0.5) * 40)
        }
        ticking = false
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion, isInView])

  const bandText = Array.from({ length: BAND_REPEATS }, () => t('common.motto')).join('   ✦   ')

  return (
    <section ref={setRefs} className="relative flex flex-col items-center gap-8 overflow-hidden bg-[hsl(var(--muted))] py-16 sm:py-20">
      <div
        className="w-full whitespace-nowrap text-center font-display font-bold leading-none text-[hsl(var(--primary-strong))]/90"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          transform: prefersReducedMotion ? undefined : `translateX(${translate}%)`,
          transition: prefersReducedMotion ? undefined : 'transform 80ms linear',
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
    </section>
  )
}

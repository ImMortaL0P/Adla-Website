import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface ScrollRevealTextProps {
  text: string
  className?: string
}

const MIN_OPACITY = 0.28

/**
 * Paragraph whose words brighten one after another as the page scrolls
 * past it — opacity is driven directly by scroll position (not a one-shot
 * fade on entering the viewport), so the reveal scrubs back and forth
 * with the scroll direction. Falls back to plain static text under
 * prefers-reduced-motion.
 */
export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const prefersReducedMotion = usePrefersReducedMotion()
  const words = text.split(' ')

  useEffect(() => {
    if (prefersReducedMotion) return

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const el = containerRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const vh = window.innerHeight
          // Reveal window: begins when the block's top is 85% down the
          // viewport, finishes once it has scrolled up to 35% of it.
          const startY = vh * 0.85
          const endY = vh * 0.35
          const progress = (startY - rect.top) / (startY - endY)
          const clamped = Math.min(1, Math.max(0, progress))
          const count = wordRefs.current.length
          wordRefs.current.forEach((span, i) => {
            if (!span) return
            const local = Math.min(1, Math.max(0, clamped * count - i))
            span.style.opacity = String(MIN_OPACITY + local * (1 - MIN_OPACITY))
          })
        }
        ticking = false
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [prefersReducedMotion, words.length])

  if (prefersReducedMotion) {
    return <p className={className}>{text}</p>
  }

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            wordRefs.current[i] = el
          }}
          style={{ opacity: MIN_OPACITY }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

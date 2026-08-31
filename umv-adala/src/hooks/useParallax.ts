import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useParallax(strength: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [offset, setOffset] = useState(0)
  
  // Also disable on small screens for performance
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            const elementCenter = rect.top + rect.height / 2
            const viewportCenter = window.innerHeight / 2
            
            // Calculate distance from center of viewport
            const distanceFromCenter = elementCenter - viewportCenter
            
            setOffset(distanceFromCenter * strength * -1)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [strength, prefersReducedMotion, isMobile])

  if (prefersReducedMotion || isMobile) {
    return { ref, style: {} }
  }

  return {
    ref,
    style: { transform: `translate3d(0, ${offset}px, 0)` }
  }
}

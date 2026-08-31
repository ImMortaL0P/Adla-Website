import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface CountUpProps {
  to: number
  duration?: number
  className?: string
}

// cubic ease-out
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function CountUp({ to, duration = 2000, className }: CountUpProps) {
  const [count, setCount] = useState(0)
  const [ref, isInView] = useInView({ triggerOnce: true })
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(to)
      return
    }

    if (!isInView) return

    let startTime: number | null = null
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easedProgress = easeOut(progress)
      
      setCount(Math.floor(easedProgress * to))

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate)
      } else {
        setCount(to)
      }
    }

    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [to, duration, isInView, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString('en-IN')}
    </span>
  )
}

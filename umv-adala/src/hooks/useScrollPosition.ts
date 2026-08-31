import { useState, useEffect } from 'react'

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollPosition)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    
    // Initial position
    updateScrollPosition()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrollPosition
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [prevOffset, setPrevOffset] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - prevOffset) < 5) {
        ticking = false
        return
      }

      setScrollDirection(scrollY > prevOffset ? 'down' : 'up')
      setPrevOffset(scrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [prevOffset])

  return scrollDirection
}

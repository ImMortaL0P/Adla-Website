import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView({
  threshold = 0,
  rootMargin = '0px 0px -10% 0px',
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<Element | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsInView(isIntersecting)

        if (isIntersecting && triggerOnce) {
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  // Need a callback ref to handle elements mounting/unmounting conditionally
  const setRef = (node: Element | null) => {
    ref.current = node
  }

  return [setRef, isInView] as const
}

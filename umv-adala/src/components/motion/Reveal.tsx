import { type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  as?: React.ElementType
}

/**
 * Scroll-reveal component using CSS transitions and IntersectionObserver.
 * Critical: Reduced motion MUST reveal content immediately without animation.
 */
export const Reveal = forwardRef<HTMLElement, RevealProps>(
  ({ children, delay = 0, direction = 'up', className, as: Component = 'div' }, forwardedRef) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [inViewRef, isInView] = useInView({ triggerOnce: true })

    // Merge refs
    const setRefs = (node: HTMLElement) => {
      inViewRef(node)
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    }

    if (prefersReducedMotion) {
      return (
        <Component ref={forwardedRef} className={className}>
          {children}
        </Component>
      )
    }

    const getTransform = () => {
      if (isInView || direction === 'none') return 'translate(0, 0)'
      switch (direction) {
        case 'up':
          return 'translateY(16px)'
        case 'down':
          return 'translateY(-16px)'
        case 'left':
          return 'translateX(16px)'
        case 'right':
          return 'translateX(-16px)'
      }
    }

    return (
      <Component
        ref={setRefs}
        className={cn('will-change-[opacity,transform]', className)}
        style={{
          opacity: isInView ? 1 : 0,
          transform: getTransform(),
          transitionProperty: 'opacity, transform',
          transitionDuration: '500ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </Component>
    )
  }
)

Reveal.displayName = 'Reveal'

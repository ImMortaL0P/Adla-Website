import { Children, cloneElement, isValidElement, type ReactNode } from 'react'

interface StaggerGroupProps {
  children: ReactNode
  stagger?: number
  className?: string
  as?: React.ElementType
}

/**
 * Passes incremental delay to children (which should accept a 'delay' prop, like Reveal).
 * Caps total stagger so long lists don't crawl.
 */
export function StaggerGroup({ children, stagger = 80, className, as: Component = 'div' }: StaggerGroupProps) {
  return (
    <Component className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child
        
        // Cap total delay at ~500ms to avoid painfully slow reveals on long lists
        const maxDelay = 500
        const calculatedDelay = index * stagger
        const delay = Math.min(calculatedDelay, maxDelay)

        return cloneElement(child, { delay } as any)
      })}
    </Component>
  )
}

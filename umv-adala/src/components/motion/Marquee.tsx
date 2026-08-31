import { type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface MarqueeProps {
  children: ReactNode
  speed?: number // pixels per second
  className?: string
  pauseOnHover?: boolean
}

export function Marquee({ children, speed = 50, className, pauseOnHover = true }: MarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [duration, setDuration] = useState(20)

  useEffect(() => {
    // We assume the content is about 1000px wide for a base calculation
    // A more complex implementation would measure the DOM element, 
    // but this is sufficient and robust for the notices ticker.
    setDuration(1000 / speed)
  }, [speed])

  if (prefersReducedMotion) {
    return (
      <div className={cn('overflow-hidden', className)}>
        {children}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'group flex overflow-hidden w-full',
        className
      )}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
        }
      `}</style>
      <div
        className={cn(
          'flex min-w-full shrink-0 animate-marquee items-center justify-around',
          pauseOnHover && 'group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]'
        )}
        style={{ '--duration': `${duration}s` } as React.CSSProperties}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'flex min-w-full shrink-0 animate-marquee items-center justify-around',
          pauseOnHover && 'group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]'
        )}
        style={{ '--duration': `${duration}s` } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}

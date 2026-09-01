import { useScrollPosition } from '@/hooks/useScrollPosition'

interface ScrollRingProps {
  /** Diameter (px) of the circle this ring wraps — should match the logo it surrounds. */
  size: number
  strokeWidth?: number
  /** Gap (px) between the logo's edge and the ring. */
  gap?: number
}

/**
 * A circular reading-progress ring, drawn just outside a same-sized circular
 * child (the header crest) via absolute positioning. Replaces the old
 * top-of-hero progress bar with something that reads site-wide, since the
 * crest it wraps lives in the header on every page.
 */
export function ScrollRing({ size, strokeWidth = 3, gap = 6 }: ScrollRingProps) {
  const scrollY = useScrollPosition()
  const documentHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 0
  const percentage = documentHeight > 0 ? Math.min(Math.max(scrollY / documentHeight, 0), 1) : 0

  const ringDiameter = size + gap * 2
  const ringRadius = ringDiameter / 2
  const circumference = 2 * Math.PI * ringRadius
  const offset = circumference * (1 - percentage)
  const svgSize = ringDiameter + strokeWidth
  const inset = gap + strokeWidth / 2

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className="pointer-events-none absolute -rotate-90"
      style={{ top: -inset, left: -inset }}
      aria-hidden="true"
    >
      <circle
        cx={svgSize / 2}
        cy={svgSize / 2}
        r={ringRadius}
        fill="none"
        stroke="white"
        strokeOpacity={0.25}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={svgSize / 2}
        cy={svgSize / 2}
        r={ringRadius}
        fill="none"
        stroke="hsl(var(--saffron))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 200ms ease-out' }}
      />
    </svg>
  )
}

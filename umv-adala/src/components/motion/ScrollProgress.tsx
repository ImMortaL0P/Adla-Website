import { useScrollPosition } from '@/hooks/useScrollPosition'
import { cn } from '@/lib/utils'

export function ScrollProgress() {
  const scrollY = useScrollPosition()
  
  // Calculate percentage
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  const percentage = documentHeight > 0 ? scrollY / documentHeight : 0

  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-[2px] w-full overflow-hidden">
      <div 
        className={cn(
          "h-full w-full origin-left bg-gradient-to-r from-[hsl(var(--saffron))] to-[hsl(var(--leaf))]",
          "will-change-transform"
        )}
        style={{ 
          transform: `scaleX(${percentage})`,
          transition: 'transform 100ms ease-out'
        }}
      />
    </div>
  )
}

import { cn } from '@/lib/utils'

interface SchoolCrestProps {
  size?: 24 | 32 | 48 | 96
  className?: string
}

export function SchoolCrest({ size = 32, className }: SchoolCrestProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[hsl(var(--foreground))]', className)}
      aria-hidden="true"
    >
      {/* Shield Base */}
      <path 
        d="M60 115C85 105 110 80 110 40V20L60 5L10 20V40C10 80 35 105 60 115Z" 
        stroke="currentColor" 
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Sun Arc */}
      <path 
        d="M30 45C30 28.4315 43.4315 15 60 15C76.5685 15 90 28.4315 90 45" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      <circle cx="60" cy="15" r="4" fill="currentColor" />
      <circle cx="35" cy="23" r="3" fill="currentColor" />
      <circle cx="85" cy="23" r="3" fill="currentColor" />
      
      {/* UMV Text */}
      <text 
        x="60" 
        y="75" 
        fontFamily="sans-serif" 
        fontSize="32" 
        fontWeight="bold" 
        fill="currentColor" 
        textAnchor="middle"
      >
        UMV
      </text>
      
      {/* Open Book Motif */}
      <path 
        d="M35 90C45 90 55 85 60 80C65 85 75 90 85 90M35 90V95C45 95 55 90 60 85C65 90 75 95 85 95V90M60 80V85" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

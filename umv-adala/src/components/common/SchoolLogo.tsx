import { cn, withBase } from '@/lib/utils'
import { useImages } from '@/hooks/useImages'

interface SchoolLogoProps {
  /** Controls display height via a Tailwind h-* class; width follows the crest's true aspect ratio. */
  className?: string
  variant?: 'main' | 'footer'
}

export function SchoolLogo({ className, variant = 'main' }: SchoolLogoProps) {
  const { getSystemImage } = useImages()
  
  // Try to use a dynamically uploaded main logo, fallback to local crest
  const logoKey = variant === 'footer' ? 'logo_footer' : 'logo_main'
  let logoUrl = getSystemImage(logoKey)
  
  if (!logoUrl && variant === 'footer') {
    logoUrl = getSystemImage('logo_main') // fallback to main if footer not specified
  }
  
  if (!logoUrl) {
    logoUrl = withBase('/images/logo/adala-crest.png')
  }

  return (
    <span className={cn('inline-block shrink-0 overflow-hidden rounded-full bg-[#FBFAF6] p-0.5 aspect-square', className)}>
      <img
        src={logoUrl}
        alt="Uchcha Madhyamik Vidyalaya Adla crest"
        className="h-full w-full object-contain"
      />
    </span>
  )
}

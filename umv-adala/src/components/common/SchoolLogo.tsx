import { cn, withBase } from '@/lib/utils'

interface SchoolLogoProps {
  /** Controls display height via a Tailwind h-* class; width follows the crest's true aspect ratio. */
  className?: string
}

/**
 * The school's official crest artwork (photographed seal, background
 * keyed out to transparency). Its line art is navy-on-transparent with
 * no backing of its own, so it would nearly disappear against the dark
 * theme's dark card/background — a light backing disc keeps it legible
 * in both themes, like a physical medallion.
 */
export function SchoolLogo({ className }: SchoolLogoProps) {
  return (
    <span className={cn('inline-block shrink-0 overflow-hidden rounded-full bg-[#FBFAF6] p-0.5 aspect-square', className)}>
      <img
        src={withBase('/images/logo/adala-crest.png')}
        alt="Uchcha Madhyamik Vidyalaya Adla crest"
        width={482}
        height={500}
        className="h-full w-full object-contain"
      />
    </span>
  )
}

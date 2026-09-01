import { Info } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import type { StockPhoto as StockPhotoData } from '@/data/stockPhotos'

interface StockPhotoProps {
  photo: StockPhotoData
  className?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  rounded?: boolean
  /** Use for small avatar-sized photos where the full caption bar won't fit — shows a small badge instead. */
  compact?: boolean
  /** Use for a photo of a person (e.g. staff) — swaps the disclaimer wording to "not the actual person". */
  isPersonPhoto?: boolean
}

/**
 * Renders a licensed, open-source stock photo used purely for illustration.
 * Always discloses that it's illustrative — a full caption bar by default,
 * or a small badge in `compact` mode — so it can never be mistaken for a
 * real photograph of UMV Adala, its students, or its staff. The <img> alt
 * text always carries the full disclaimer regardless of mode.
 */
export function StockPhoto({ photo, className, imgClassName, loading = 'lazy', rounded = true, compact = false, isPersonPhoto = false }: StockPhotoProps) {
  const { t, lang } = useT()
  const disclaimer = t(isPersonPhoto ? 'common.illustrativePhotoPerson' : 'common.illustrativePhoto')

  return (
    <figure className={cn('relative overflow-hidden', rounded && 'rounded-2xl', className)}>
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt[lang]}
        loading={loading}
        className={cn('h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105', imgClassName)}
      />
      {compact ? (
        <span
          title={`${disclaimer} — ${t('common.photoCredit')}: ${photo.credit}`}
          className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <Info size={12} aria-hidden="true" />
        </span>
      ) : (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[11px] text-white">
          <span className="font-medium">{disclaimer}</span>
          <a
            href={photo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-white/80 underline decoration-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t('common.photoCredit')}: {photo.credit}
          </a>
        </figcaption>
      )}
    </figure>
  )
}

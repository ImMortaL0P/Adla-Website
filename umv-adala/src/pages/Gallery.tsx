import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { StockPhoto } from '@/components/common/StockPhoto'
import { EmptyState } from '@/components/common/EmptyState'
import { staticGallery, staticGalleryStock } from '@/data/gallery'
import { stockPhotos } from '@/data/stockPhotos'
import { pick, cn } from '@/lib/utils'
import type { GalleryCategory } from '@/types/domain'

const filters: Array<{ value: GalleryCategory | 'all'; labelKey: string }> = [
  { value: 'all', labelKey: 'gallery.filter.all' },
  { value: 'campus', labelKey: 'gallery.filter.campus' },
  { value: 'classrooms', labelKey: 'gallery.filter.classrooms' },
  { value: 'events', labelKey: 'gallery.filter.events' },
  { value: 'sports', labelKey: 'gallery.filter.sports' },
  { value: 'annual_function', labelKey: 'gallery.filter.annualFunction' },
  { value: 'independence_day', labelKey: 'gallery.filter.independenceDay' },
]

const variants = ['saffron', 'leaf', 'sky', 'clay'] as const

export default function Gallery() {
  const { t, lang } = useT()
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const published = staticGallery.filter((g) => g.is_published)
    return activeFilter === 'all' ? published : published.filter((g) => g.category === activeFilter)
  }, [activeFilter])

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null

  const showPrev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
  const showNext = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length))

  return (
    <>
      <Seo titleKey="gallery.title" path="/gallery" />
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('gallery.overline')} title={t('gallery.title')} level={1} />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              aria-pressed={activeFilter === f.value}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                activeFilter === f.value
                  ? 'border-[hsl(var(--primary-strong))] bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              {t(f.labelKey as any)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ImageIcon} title={t('gallery.empty')} description="" />
        ) : (
          <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
            {filtered.map((image, i) => {
              const stockKey = staticGalleryStock[image.id]
              return (
                <Reveal key={image.id} delay={Math.min(i * 50, 400)} className="break-inside-avoid">
                  <button
                    onClick={() => setLightboxIndex(i)}
                    className="block w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                    aria-label={pick(image, 'caption', lang)}
                  >
                    {stockKey ? (
                      <StockPhoto photo={stockPhotos[stockKey]} className="w-full transition-transform hover:scale-[1.02]" />
                    ) : (
                      <PlaceholderImage
                        initials="📷"
                        size="xl"
                        variant={variants[i % variants.length]}
                        className="aspect-square w-full transition-transform hover:scale-[1.02]"
                      />
                    )}
                  </button>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>

      <Dialog.Root open={current !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') showPrev()
              if (e.key === 'ArrowRight') showNext()
            }}
          >
            <Dialog.Title className="sr-only">{current ? pick(current, 'caption', lang) : ''}</Dialog.Title>
            <Dialog.Close
              aria-label={t('gallery.lightbox.close')}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={20} />
            </Dialog.Close>

            {current && (
              <div className="flex max-w-2xl flex-col items-center gap-4">
                {staticGalleryStock[current.id] ? (
                  <StockPhoto photo={stockPhotos[staticGalleryStock[current.id]!]} className="w-full max-w-md" />
                ) : (
                  <PlaceholderImage initials="📷" size="xl" variant={variants[(lightboxIndex ?? 0) % variants.length]} className="w-full max-w-md" />
                )}
                <p className="text-center text-sm text-white/90">{pick(current, 'caption', lang)}</p>
              </div>
            )}

            <button
              onClick={showPrev}
              aria-label={t('gallery.lightbox.prev')}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={showNext}
              aria-label={t('gallery.lightbox.next')}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
            >
              <ChevronRight size={22} />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

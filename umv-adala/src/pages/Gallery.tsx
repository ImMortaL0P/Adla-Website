import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Calendar } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { StockPhoto } from '@/components/common/StockPhoto'
import { EmptyState } from '@/components/common/EmptyState'
import { staticGallery, staticGalleryStock } from '@/data/gallery'
import { stockPhotos } from '@/data/stockPhotos'
import { useGallery } from '@/hooks/useGallery'
import { pick } from '@/lib/utils'
import type { GalleryImage } from '@/types/domain'

const variants = ['saffron', 'leaf', 'sky', 'clay'] as const

function hasDriveImage(image: GalleryImage) {
  return Boolean(image.image_url)
}

interface EventGroup {
  eventKey: string
  eventName: { en: string; hi: string }
  eventDate: Date | null
  eventDescription?: { en: string; hi: string }
  category: string
  images: GalleryImage[]
}

const MAX_PREVIEW_IMAGES = 6;

export default function Gallery() {
  const { t, lang } = useT()
  const { images: liveImages, loading } = useGallery()
  const [lightboxIndex, setLightboxIndex] = useState<{ groupIndex: number; imageIndex: number } | null>(null)

  // Track which groups are fully expanded ("View more" clicked)
  const [expandedViewMore, setExpandedViewMore] = useState<Set<string>>(new Set())

  // Group images by event or category
  const eventGroups = useMemo(() => {
    const source = liveImages.length > 0 ? liveImages : staticGallery.filter((g) => g.is_published)
    const filtered = source // use all images since no filter is used


    const groups = new Map<string, EventGroup>()

    filtered.forEach((image) => {
      const eventKey = image.event_name_en || image.category

      if (!groups.has(eventKey)) {
        groups.set(eventKey, {
          eventKey,
          eventName: {
            en: image.event_name_en || (image.category?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) || 'Uncategorized',
            hi: image.event_name_hi || (image.category?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) || 'वर्गीकृत नहीं',
          },
          eventDate: image.event_date ? new Date(image.event_date) : null,
          eventDescription: image.event_description_en ? {
            en: image.event_description_en,
            hi: image.event_description_hi || image.event_description_en,
          } : undefined,
          category: image.category || 'uncategorized',
          images: [],
        })
      }

      groups.get(eventKey)!.images.push(image)
    })

    // Sort by date (most recent first), then by name
    return Array.from(groups.values()).sort((a, b) => {
      if (a.eventDate && b.eventDate) {
        return b.eventDate.getTime() - a.eventDate.getTime()
      }
      if (a.eventDate) return -1
      if (b.eventDate) return 1
      return a.eventName.en.localeCompare(b.eventName.en)
    })
  }, [liveImages])

  const toggleViewMore = (key: string) => {
    setExpandedViewMore((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const flatImages = useMemo(() => {
    return eventGroups.flatMap((group) => group.images)
  }, [eventGroups])

  const currentImage = lightboxIndex
    ? eventGroups[lightboxIndex.groupIndex]?.images[lightboxIndex.imageIndex]
    : null
  const usingLive = liveImages.length > 0

  const showPrev = () => {
    if (!lightboxIndex) return
    if (lightboxIndex.imageIndex > 0) {
      setLightboxIndex({ ...lightboxIndex, imageIndex: lightboxIndex.imageIndex - 1 })
    } else if (lightboxIndex.groupIndex > 0) {
      const prevGroup = eventGroups[lightboxIndex.groupIndex - 1]
      setLightboxIndex({ groupIndex: lightboxIndex.groupIndex - 1, imageIndex: prevGroup.images.length - 1 })
    }
  }

  const showNext = () => {
    if (!lightboxIndex) return
    const group = eventGroups[lightboxIndex.groupIndex]
    if (lightboxIndex.imageIndex < group.images.length - 1) {
      setLightboxIndex({ ...lightboxIndex, imageIndex: lightboxIndex.imageIndex + 1 })
    } else if (lightboxIndex.groupIndex < eventGroups.length - 1) {
      setLightboxIndex({ groupIndex: lightboxIndex.groupIndex + 1, imageIndex: 0 })
    }
  }

  return (
    <>
      <Seo titleKey="gallery.title" path="/gallery" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading title={t('gallery.title')} level={1} />

        {loading ? (
          <div className="py-16 text-center text-[hsl(var(--muted-foreground))]">Loading gallery...</div>
        ) : eventGroups.length === 0 ? (
          <EmptyState icon={ImageIcon} title={t('gallery.empty')} description="" />
        ) : (
          <div className="space-y-16">
            {eventGroups.map((group, groupIndex) => {
              const isExpanded = expandedViewMore.has(group.eventKey)
              const visibleImages = isExpanded ? group.images : group.images.slice(0, MAX_PREVIEW_IMAGES)
              const hiddenCount = group.images.length - visibleImages.length

              return (
                <div key={group.eventKey} className="group flex flex-col gap-6">
                  {/* Category Header Label */}
                  <div className="flex flex-col gap-2 md:flex-row md:items-end justify-between border-b border-[hsl(var(--border))] pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">
                          {group.eventName[lang] || group.eventName.en}
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--foreground))] opacity-80">
                          {group.images.length}
                        </span>
                      </div>

                      {group.eventDate && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                          <Calendar size={14} />
                          <span>{group.eventDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}

                      {group.eventDescription && (
                        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-2xl">
                          {group.eventDescription[lang] || group.eventDescription.en}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {visibleImages.map((image, imageIndex) => {
                      const stockKey = !usingLive ? staticGalleryStock[image.id] : undefined
                      const globalIndex = flatImages.indexOf(image)
                      return (
                        <Reveal key={image.id} delay={Math.min(imageIndex * 40, 300)}>
                          <button
                            onClick={() => setLightboxIndex({ groupIndex, imageIndex })}
                            className="group/img block aspect-[4/3] w-full overflow-hidden rounded-xl bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            aria-label={pick(image, 'caption', lang) || 'Gallery image'}
                          >
                            {hasDriveImage(image) ? (
                              <img
                                src={image.thumbnail_url || image.image_url}
                                alt={pick(image, 'caption', lang) || ''}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                                loading="lazy"
                              />
                            ) : stockKey ? (
                              <StockPhoto photo={stockPhotos[stockKey]} className="h-full w-full transition-transform duration-500 group-hover/img:scale-105" />
                            ) : (
                              <PlaceholderImage
                                initials="📷"
                                size="lg"
                                variant={variants[globalIndex % variants.length]}
                                className="h-full w-full transition-transform duration-500 group-hover/img:scale-105"
                              />
                            )}
                          </button>
                        </Reveal>
                      )
                    })}
                  </div>

                  {/* View More / Show Less Toggle */}
                  {group.images.length > MAX_PREVIEW_IMAGES && (
                    <div className="flex justify-center mt-2">
                      <button
                        onClick={() => toggleViewMore(group.eventKey)}
                        className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--muted))] active:scale-[0.98]"
                      >
                        {isExpanded ? 'Show less' : `View more (${hiddenCount})`}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Dialog.Root open={currentImage !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-8 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') showPrev()
              if (e.key === 'ArrowRight') showNext()
            }}
          >
            <Dialog.Title className="sr-only">{currentImage ? pick(currentImage, 'caption', lang) : ''}</Dialog.Title>
            <Dialog.Close
              aria-label={t('gallery.lightbox.close')}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={24} />
            </Dialog.Close>

            {currentImage && (
              <div className="flex h-full w-full max-w-5xl flex-col items-center justify-center gap-6">
                <div className="relative flex h-[75vh] w-full items-center justify-center">
                  {hasDriveImage(currentImage) ? (
                    <img
                      src={currentImage.image_url}
                      alt={pick(currentImage, 'caption', lang) || ''}
                      className="max-h-full max-w-full object-contain drop-shadow-2xl"
                    />
                  ) : staticGalleryStock[currentImage.id] ? (
                    <StockPhoto photo={stockPhotos[staticGalleryStock[currentImage.id]!]} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <PlaceholderImage initials="📷" size="xl" variant={variants[(flatImages.indexOf(currentImage)) % variants.length]} className="max-h-full max-w-full object-contain" />
                  )}
                </div>

                {pick(currentImage, 'caption', lang) && (
                  <p className="max-w-2xl text-center text-base font-medium text-white/90">
                    {pick(currentImage, 'caption', lang)}
                  </p>
                )}

                <div className="text-sm font-medium tracking-wide text-white/50">
                  {eventGroups[lightboxIndex!.groupIndex].eventName.en} · {lightboxIndex!.imageIndex + 1} / {eventGroups[lightboxIndex!.groupIndex].images.length}
                </div>
              </div>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label={t('gallery.lightbox.prev')}
              className="absolute left-2 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-8"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label={t('gallery.lightbox.next')}
              className="absolute right-2 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-8"
            >
              <ChevronRight size={32} />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

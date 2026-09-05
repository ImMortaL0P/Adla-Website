import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Collapsible from '@radix-ui/react-collapsible'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, ChevronDown, Calendar } from 'lucide-react'
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
import { pick, cn } from '@/lib/utils'
import type { GalleryImage, GalleryCategory } from '@/types/domain'

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

function hasDriveImage(image: GalleryImage) {
  return Boolean(image.image_url)
}

interface EventGroup {
  eventKey: string
  eventName: { en: string; hi: string }
  eventDate: Date | null
  eventDescription?: { en: string; hi: string }
  category: GalleryCategory
  images: GalleryImage[]
}

export default function Gallery() {
  const { t, lang } = useT()
  const { images: liveImages, loading } = useGallery()
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<{ groupIndex: number; imageIndex: number } | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Group images by event or category
  const eventGroups = useMemo(() => {
    const source = liveImages.length > 0 ? liveImages : staticGallery.filter((g) => g.is_published)
    const filtered = activeFilter === 'all' ? source : source.filter((g) => g.category === activeFilter)

    // Group by event_name_en OR category if no event
    const groups = new Map<string, EventGroup>()

    filtered.forEach((image) => {
      const eventKey = image.event_name_en || image.category

      if (!groups.has(eventKey)) {
        groups.set(eventKey, {
          eventKey,
          eventName: {
            en: image.event_name_en || t(`gallery.filter.${image.category}` as any),
            hi: image.event_name_hi || t(`gallery.filter.${image.category}` as any),
          },
          eventDate: image.event_date ? new Date(image.event_date) : null,
          eventDescription: image.event_description_en ? {
            en: image.event_description_en,
            hi: image.event_description_hi || image.event_description_en,
          } : undefined,
          category: image.category,
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
  }, [activeFilter, liveImages, t, lang])

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const toggleAllGroups = () => {
    if (expandedGroups.size === eventGroups.length) {
      setExpandedGroups(new Set())
    } else {
      setExpandedGroups(new Set(eventGroups.map((g) => g.eventKey)))
    }
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
    const group = eventGroups[lightboxIndex.groupIndex]
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

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              aria-pressed={activeFilter === f.value}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200',
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

        {eventGroups.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={toggleAllGroups}
              className="text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline"
            >
              {expandedGroups.size === eventGroups.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[hsl(var(--muted-foreground))]">Loading gallery...</div>
        ) : eventGroups.length === 0 ? (
          <EmptyState icon={ImageIcon} title={t('gallery.empty')} description="" />
        ) : (
          <div className="space-y-6">
            {eventGroups.map((group, groupIndex) => (
              <Collapsible.Root
                key={group.eventKey}
                open={expandedGroups.has(group.eventKey)}
                onOpenChange={() => toggleGroup(group.eventKey)}
              >
                <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  <Collapsible.Trigger className="w-full">
                    <div className="flex items-center justify-between p-6 transition-colors hover:bg-[hsl(var(--muted))]">
                      <div className="flex items-start gap-4 text-left">
                        <ChevronDown
                          size={20}
                          className={cn(
                            'mt-1 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200',
                            expandedGroups.has(group.eventKey) && 'rotate-180'
                          )}
                        />
                        <div>
                          <h3 className="mb-1 font-display text-xl font-semibold text-[hsl(var(--foreground))]">
                            {pick(group.eventName, lang)}
                          </h3>
                          {group.eventDate && (
                            <div className="mb-2 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                              <Calendar size={14} />
                              <span>{group.eventDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                          )}
                          {group.eventDescription && (
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              {pick(group.eventDescription, lang)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-[hsl(var(--muted))] px-3 py-1 text-sm font-medium text-[hsl(var(--foreground))]">
                        {group.images.length} {group.images.length === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>
                  </Collapsible.Trigger>

                  <Collapsible.Content>
                    <div className="border-t border-[hsl(var(--border))] p-4">
                      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
                        {group.images.map((image, imageIndex) => {
                          const stockKey = !usingLive ? staticGalleryStock[image.id] : undefined
                          const globalIndex = flatImages.indexOf(image)
                          return (
                            <Reveal key={image.id} delay={Math.min(imageIndex * 40, 300)} className="break-inside-avoid">
                              <button
                                onClick={() => setLightboxIndex({ groupIndex, imageIndex })}
                                className="block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                                aria-label={pick(image, 'caption', lang)}
                              >
                                {hasDriveImage(image) ? (
                                  <img
                                    src={image.thumbnail_url || image.image_url}
                                    alt={pick(image, 'caption', lang)}
                                    className="w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                                    loading="lazy"
                                  />
                                ) : stockKey ? (
                                  <StockPhoto photo={stockPhotos[stockKey]} className="w-full transition-transform duration-300 hover:scale-[1.02]" />
                                ) : (
                                  <PlaceholderImage
                                    initials="📷"
                                    size="xl"
                                    variant={variants[globalIndex % variants.length]}
                                    className="aspect-square w-full transition-transform duration-300 hover:scale-[1.02]"
                                  />
                                )}
                              </button>
                            </Reveal>
                          )
                        })}
                      </div>
                    </div>
                  </Collapsible.Content>
                </div>
              </Collapsible.Root>
            ))}
          </div>
        )}
      </div>

      <Dialog.Root open={currentImage !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') showPrev()
              if (e.key === 'ArrowRight') showNext()
            }}
          >
            <Dialog.Title className="sr-only">{currentImage ? pick(currentImage, 'caption', lang) : ''}</Dialog.Title>
            <Dialog.Close
              aria-label={t('gallery.lightbox.close')}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={20} />
            </Dialog.Close>

            {currentImage && (
              <div className="flex max-w-3xl flex-col items-center gap-4">
                {hasDriveImage(currentImage) ? (
                  <img
                    src={currentImage.image_url}
                    alt={pick(currentImage, 'caption', lang)}
                    className="max-h-[75vh] w-full rounded-lg object-contain"
                  />
                ) : staticGalleryStock[currentImage.id] ? (
                  <StockPhoto photo={stockPhotos[staticGalleryStock[currentImage.id]!]} className="w-full max-w-md" />
                ) : (
                  <PlaceholderImage initials="📷" size="xl" variant={variants[(flatImages.indexOf(currentImage)) % variants.length]} className="w-full max-w-md" />
                )}
                <p className="text-center text-sm text-white/90">{pick(currentImage, 'caption', lang)}</p>
              </div>
            )}

            <button
              onClick={showPrev}
              aria-label={t('gallery.lightbox.prev')}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={showNext}
              aria-label={t('gallery.lightbox.next')}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
            >
              <ChevronRight size={22} />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

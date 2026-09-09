import { Link } from 'react-router-dom'
import { useT } from '@/context/LanguageContext'
import { useMemo } from 'react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { CircularArrow } from '@/components/common/CircularArrow'
import { useGallery } from '@/hooks/useGallery'
import { pick } from '@/lib/utils'
import { ProtectedImage } from '@/components/common/ProtectedImage'

export function GalleryPreview() {
  const { t, lang } = useT()
  const { images: liveImages } = useGallery()

  const preview = useMemo(() => {
    if (liveImages.length <= 6) return liveImages;
    // Shuffle copy
    const shuffled = [...liveImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [liveImages]);


  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <SectionHeading title={t('home.gallery.title')} />
      <StaggerGroup stagger={60} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {preview.map((image, i) => {
          return (
            <Reveal key={image.id} className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}>
              {image.image_url ? (
                <ProtectedImage
                  src={image.thumbnail_url || image.image_url}
                  alt={pick(image, 'caption', lang) || ''}
                  containerClassName="h-full min-h-[100px] w-full shrink-0 overflow-hidden rounded-2xl"
                  className="h-full min-h-[100px] w-full object-cover"
                />
              ) : (
                <PlaceholderImage
                  initials={pick(image, 'caption', lang).slice(0, 2).toUpperCase() || '🏫'}
                  size="xl"
                  variant={(['saffron', 'leaf', 'sky', 'clay'] as const)[i % 4]}
                  className="h-full min-h-[100px] w-full"
                />
              )}
            </Reveal>
          )
        })}
      </StaggerGroup>
      <div className="mt-8 flex justify-center">
        <Link
          to="/gallery"
          className="group inline-flex items-center gap-3 font-medium text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
        >
          {t('home.gallery.viewAll')}
          <CircularArrow />
        </Link>
      </div>
    </section>
  )
}


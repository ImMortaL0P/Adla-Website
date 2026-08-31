import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { SectionHeading } from '@/components/common/SectionHeading'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { StockPhoto } from '@/components/common/StockPhoto'
import { staticGallery, staticGalleryStock } from '@/data/gallery'
import { stockPhotos } from '@/data/stockPhotos'
import { pick } from '@/lib/utils'

export function GalleryPreview() {
  const { t, lang } = useT()
  const preview = staticGallery.slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <SectionHeading overline={t('home.gallery.overline')} title={t('home.gallery.title')} />
      <StaggerGroup stagger={60} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {preview.map((image, i) => {
          const stockKey = staticGalleryStock[image.id]
          return (
            <Reveal key={image.id} className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}>
              {stockKey ? (
                <StockPhoto photo={stockPhotos[stockKey]} className="h-full min-h-[100px] w-full" imgClassName="aspect-square sm:aspect-auto sm:h-full" />
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
          className="inline-flex items-center gap-2 font-medium text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
        >
          {t('home.gallery.viewAll')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

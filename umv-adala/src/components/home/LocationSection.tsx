import { MapPin, ExternalLink } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { school } from '@/data/school'
import { pick } from '@/lib/utils'

export function LocationSection() {
  const { t, lang } = useT()
  const { lat, lng } = school.coordinates
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <SectionHeading overline={t('home.location.overline')} title={t('home.location.title')} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))]">
            <iframe
              title="School location map"
              src={embedUrl}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
        <Reveal direction="left">
          <div className="flex h-full flex-col justify-center gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-1 shrink-0 text-[hsl(var(--primary-strong))]" />
              <p className="text-[hsl(var(--foreground))]">{pick(school, 'address', lang)}</p>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
            >
              {t('home.location.directions')}
              <ExternalLink size={15} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

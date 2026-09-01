import { MapPin, ExternalLink, Plane, TrainFront, Landmark, type LucideIcon } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { school, nearbyLandmarks } from '@/data/school'

const landmarkIcons: Record<string, LucideIcon> = { Plane, TrainFront, Landmark }

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
          <div className="flex h-full flex-col gap-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-1 shrink-0 text-[hsl(var(--primary-strong))]" />
              <p className="text-[hsl(var(--foreground))]">{school.address[lang]}</p>
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

            <div className="mt-1 border-t border-[hsl(var(--border))] pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {t('home.location.nearby')}
              </p>
              <ul className="flex flex-col gap-3">
                {nearbyLandmarks.map((landmark) => {
                  const Icon = landmarkIcons[landmark.icon]
                  return (
                    <li key={landmark.key} className="flex items-center gap-3 text-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--primary-strong))]">
                        <Icon size={15} strokeWidth={1.75} />
                      </span>
                      <span className="flex-1 text-[hsl(var(--foreground))]">{landmark.name[lang]}</span>
                      <span className="shrink-0 font-medium text-[hsl(var(--muted-foreground))]">{landmark.distanceKm} km</span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-3 text-[11px] text-[hsl(var(--muted-foreground))]">
                {t('home.location.distanceNote')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

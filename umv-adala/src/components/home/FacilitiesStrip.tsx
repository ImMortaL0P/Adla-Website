import { BookOpen, FlaskConical, Monitor, Trees, Utensils, Droplets, DoorClosed, ShieldCheck, type LucideIcon } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { facilitiesList } from '@/data/content'

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  FlaskConical,
  Monitor,
  Trees,
  Utensils,
  Droplets,
  DoorClosed,
  ShieldCheck,
}

export function FacilitiesStrip() {
  const { t } = useT()

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <SectionHeading overline={t('home.facilities.overline')} title={t('home.facilities.title')} />
      <StaggerGroup stagger={60} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {facilitiesList.map((facility) => {
          const Icon = iconMap[facility.icon]
          return (
            <Reveal key={facility.key}>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-6 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--primary-strong))]">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {t(`home.facilities.${facility.key}` as any)}
                </span>
              </div>
            </Reveal>
          )
        })}
      </StaggerGroup>
    </section>
  )
}

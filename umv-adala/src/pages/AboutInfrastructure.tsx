import { BookOpen, FlaskConical, Monitor, Trees, Utensils, Droplets, DoorClosed, ShieldCheck, type LucideIcon } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { StockPhoto } from '@/components/common/StockPhoto'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { facilitiesList } from '@/data/content'
import { stockPhotos, type StockPhotoKey } from '@/data/stockPhotos'

const facilityPhotos: Partial<Record<string, StockPhotoKey>> = {
  midDayMeal: 'facilityMidDayMeal',
  computerLab: 'facilityComputerLab',
}

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

export default function AboutInfrastructure() {
  const { t, lang } = useT()

  return (
    <>
      <Seo titleKey="about.infra.title" path="/about/infrastructure" />
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: t('common.nav.aboutSchool'), href: '/about' }, { label: t('about.infra.title') }]} />
        <SectionHeading overline={t('about.infra.overline')} title={t('about.infra.title')} level={1} />
        <StaggerGroup stagger={70} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {facilitiesList.map((facility) => {
            const Icon = iconMap[facility.icon]
            const photoKey = facilityPhotos[facility.key]
            return (
              <Reveal key={facility.key}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  {photoKey && <StockPhoto photo={stockPhotos[photoKey]} className="aspect-[16/9] w-full" rounded={false} />}
                  <div className="flex items-start gap-4 p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--primary-strong))]">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="mb-1 font-semibold text-[hsl(var(--foreground))]">
                        {t(`home.facilities.${facility.key}` as any)}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{facility.desc[lang]}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </StaggerGroup>
        <p className="mt-10 text-sm text-[hsl(var(--muted-foreground))]">
          {t('common.placeholder')} — {t('disclosure.title')}: <a href="/mandatory-disclosure" className="text-[hsl(var(--primary-strong))] hover:underline">{t('disclosure.title')}</a>
        </p>
      </div>
    </>
  )
}

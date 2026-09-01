import { useT } from '@/context/LanguageContext'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { CountUp } from '@/components/motion/CountUp'
import { school } from '@/data/school'

export function StatsStrip() {
  const { t } = useT()

  const stats = [
    { label: t('home.stats.classes'), value: 12 },
    { label: t('home.stats.teachers'), value: school.teacherCount },
    { label: t('home.stats.students'), value: school.studentCount },
    { label: t('home.stats.established'), value: school.established },
  ]

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <SectionHeading overline={t('common.govAttribution')} title={t('home.stats.title')} />
      <StaggerGroup stagger={80} className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {stats.map((stat) => (
          <Reveal key={stat.label}>
            <div className="flex flex-col items-center rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
              <span className="font-display text-3xl font-bold text-[hsl(var(--primary-strong))] sm:text-4xl">
                {typeof stat.value === 'number' ? <CountUp to={stat.value} /> : stat.value}
              </span>
              <span className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </StaggerGroup>
      <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
        {t('home.stats.provisional')}
      </p>
    </section>
  )
}

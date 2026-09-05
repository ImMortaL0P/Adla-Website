import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { CountUp } from '@/components/motion/CountUp'
import { school } from '@/data/school'
import { cn } from '@/lib/utils'

export function StatsStrip() {
  const { t } = useT()

  const stats = [
    { label: t('home.stats.classes'), value: 4 },
    { label: t('home.stats.teachers'), value: school.teacherCount },
    { label: t('home.stats.students'), value: school.studentCount },
    { label: t('home.stats.established'), value: school.established, subtext: 'नवसृजित' },
  ]

  return (
    <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <StaggerGroup
          stagger={80}
          className="grid grid-cols-2 divide-x divide-y divide-[hsl(var(--border))] sm:grid-cols-4 sm:divide-y-0"
        >
          {stats.map((stat, i) => (
            <Reveal key={stat.label}>
              <div
                className={cn(
                  'flex h-full flex-col items-center justify-center px-4 py-8 text-center',
                  i % 2 === 1 && 'border-l border-[hsl(var(--border))] sm:border-l',
                  i % 2 === 0 && 'sm:border-l-0',
                  i < 2 && 'border-b border-[hsl(var(--border))] sm:border-b-0',
                  i > 1 && 'border-t-0 sm:border-t-0',
                )}
              >
                <span className="font-display text-3xl font-bold tabular-nums text-[hsl(var(--primary-strong))] sm:text-4xl">
                  {typeof stat.value === 'number' ? <CountUp to={stat.value} /> : stat.value}
                </span>
                <span className="mt-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">{stat.label}</span>
                {stat.subtext && (
                  <span className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{stat.subtext}</span>
                )}
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
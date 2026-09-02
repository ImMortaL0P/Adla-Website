import { Link } from 'react-router-dom'
import { GraduationCap, Landmark } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { cn } from '@/lib/utils'

const stages = [
  { href: '/academics/secondary', labelKey: 'common.nav.secondary', code: 'Code: 71485', icon: Landmark, variant: 'sky' },
  { href: '/academics/senior', labelKey: 'common.nav.senior', code: 'Code: 17355', icon: GraduationCap, variant: 'clay' },
] as const

const variantStyles: Record<string, string> = {
  saffron: 'bg-[hsl(var(--saffron))]/12 text-[hsl(var(--primary-strong))]',
  leaf: 'bg-[hsl(var(--leaf))]/12 text-[hsl(var(--secondary-strong))]',
  sky: 'bg-[hsl(var(--sky))]/12 text-[hsl(var(--accent-strong))]',
  clay: 'bg-[hsl(var(--clay))]/12 text-[hsl(var(--clay-strong))]',
}

export function AcademicsGrid() {
  const { t } = useT()

  return (
    <section className="bg-[hsl(var(--muted))]/50 py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading overline={t('home.academics.overline')} title={t('home.academics.title')} shimmer />
        <StaggerGroup stagger={80} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {stages.map((stage) => (
            <Reveal key={stage.href}>
              <Link
                to={stage.href}
                className={cn(
                  'group flex h-full flex-col items-start gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6',
                  'transition-all duration-500 hover:-translate-y-1 hover:shadow-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
                )}
              >
                <div className="flex w-full items-start justify-between">
                  <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl', variantStyles[stage.variant])}>
                    <stage.icon size={22} strokeWidth={1.75} />
                  </span>
                  <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                    {stage.code}
                  </span>
                </div>
                <span className="font-display text-lg font-semibold text-[hsl(var(--foreground))]">
                  {t(stage.labelKey as any)}
                </span>
              </Link>
            </Reveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

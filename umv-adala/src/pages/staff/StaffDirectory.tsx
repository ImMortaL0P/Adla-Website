import { useMemo, useState } from 'react'

import { Search, Users } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { ProtectedImage } from "@/components/common/ProtectedImage"
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { EmptyState } from '@/components/common/EmptyState'
import { useImages } from "@/hooks/useImages"
import { useStaff } from "@/hooks/useStaff"
import { cn } from '@/lib/utils'

const filters: Array<{ value: string; labelKey: string }> = [
  { value: 'all', labelKey: 'staff.filter.all' },
  { value: 'maths_science', labelKey: 'staff.filter.mathsScience' },
  { value: 'languages', labelKey: 'staff.filter.languages' },
  { value: 'social_science', labelKey: 'staff.filter.socialScience' },
  { value: 'commerce', labelKey: 'staff.filter.commerce' },
  { value: 'arts', labelKey: 'staff.filter.arts' },
  { value: 'administration', labelKey: 'staff.filter.administration' },
  { value: 'support', labelKey: 'staff.filter.support' },
]

const variants = ['saffron', 'leaf', 'sky', 'clay'] as const

function initialsOf(name: string) {
  return name
    .replace(/[—–-].*$/, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function StaffDirectory() {
  const { t, lang } = useT()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [query, setQuery] = useState('')

  const { staffList } = useStaff()
  const { getSystemImage } = useImages()
  const hmImage = getSystemImage('headmaster_photo')

  const filtered = useMemo(() => {
    const active = staffList || [];
    const getCat = (s: any) => {
      const isSupport = s.type === 'support' || s.department === 'support';
      const role = (s.role_en || s.designation_en || s.designation?.en || '').toLowerCase();
      
      if (isSupport) {
         if (role.includes('clerk') || role.includes('accountant') || role.includes('headmaster')) return 'administration';
         return 'support';
      }
      
      if (role.includes('headmaster') || role.includes('principal') || role.includes('clerk')) return 'administration';
      
      if (role.includes('math') || role.includes('physics') || role.includes('chemistry') || role.includes('biology') || role.includes('zoology') || role.includes('science') || role.includes('computer')) return 'maths_science';
      if (role.includes('english') || role.includes('hindi') || role.includes('sanskrit') || role.includes('urdu')) return 'languages';
      if (role.includes('business') || role.includes('entrepreneurship') || role.includes('commerce') || role.includes('accountancy')) return 'commerce';
      if (role.includes('music') || role.includes('art') || role.includes('sport') || role.includes('physical')) return 'arts';
      
      // social_science covers S.ST, History, Geography, etc.
      if (role.includes('s. st') || role.includes('history') || role.includes('geography') || role.includes('civics') || role.includes('social')) return 'social_science';
      
      // Fallback for generic teachers could be spread or put into all
      return 'social_science'; // Or return a default
    }

    const byDept = activeFilter === 'all'
      ? active
      : active.filter((s: any) => getCat(s) === activeFilter);

    const q = query.trim().toLowerCase()
    if (!q) return byDept
    return byDept.filter((s: any) => {
      const name = (lang === 'en' ? (s.name_en || s.name?.en) : (s.name_hi || s.name?.hi) || '').toLowerCase()
      const role = (lang === 'en' ? (s.role_en || s.designation?.en) : (s.role_hi || s.designation?.hi) || '').toLowerCase()
      return name.includes(q) || role.includes(q)
    })
  }, [activeFilter, query, lang, staffList])

  return (
    <>
      <Seo titleKey="staff.title" path="/staff" />
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('staff.overline')} title={t('staff.title')} level={1} />

        <div className="mb-8 flex flex-col gap-4">
          <div className="relative mx-auto w-full max-w-md">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('staff.search')}
              aria-label={t('staff.search')}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                aria-pressed={activeFilter === f.value}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
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
        </div>

        <p className="mb-6 text-center text-sm text-[hsl(var(--muted-foreground))]" aria-live="polite">
          {t('staff.resultsCount', { count: filtered.length })}
        </p>

        {filtered.length === 0 ? (
          <EmptyState icon={Users} title={t('staff.noResults')} description="" />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member: any, i: number) => {
              const roleStr = (member.role_en || member.designation?.en || '').toLowerCase()
              const isHM = roleStr.includes('headmaster') || roleStr.includes('principal')
              const portrait = member.imageUrl || member.photo_url || (isHM ? hmImage : null)
              const name = lang === 'en' ? (member.name_en || member.name?.en) : (member.name_hi || member.name?.hi)
              const role = lang === 'en' ? (member.role_en || member.designation?.en) : (member.role_hi || member.designation?.hi)
              const qualifications = lang === 'en' ? (member.qualifications_en || member.qualifications?.en) : (member.qualifications_hi || member.qualifications?.hi)

              return (
              <Reveal key={member.id || i} delay={Math.min(i * 60, 400)}>
                <div
                  className="flex h-full flex-col items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {portrait ? (
                    <ProtectedImage src={portrait} alt={name} containerClassName="h-24 w-24 shrink-0 overflow-hidden rounded-full mx-auto" className="h-full w-full object-cover" />
                  ) : (
                    <PlaceholderImage
                      initials={initialsOf(name || '')}
                      size="lg"
                      variant={variants[i % variants.length]}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">{name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{role}</p>
                    {qualifications && (
                      <p className="mt-1 text-xs text-[hsl(var(--primary-strong))]">{qualifications}</p>
                    )}
                  </div>
                </div>
              </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

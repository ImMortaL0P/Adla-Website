import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, UserX } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { StockPhoto } from '@/components/common/StockPhoto'
import { EmptyState } from '@/components/common/EmptyState'
import { staticStaff } from '@/data/staff'
import { findStaffPortraitBySrc } from '@/data/stockPhotos'
import { pick } from '@/lib/utils'

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

export default function StaffProfile() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useT()
  const member = staticStaff.find((s) => s.slug === slug && s.is_active)
  const portrait = member ? findStaffPortraitBySrc(member.photo_url) : undefined

  if (!member) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-12">
        <EmptyState icon={UserX} title={t('staff.notFound')} description="" />
        <div className="mt-6 text-center">
          <Link to="/staff" className="text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline">
            {t('staff.backToDirectory')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo titleString={pick(member, 'name', lang)} path={`/staff/${member.slug}`} />
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: t('staff.title'), href: '/staff' }, { label: pick(member, 'name', lang) }]} />
        <Link
          to="/staff"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
        >
          <ArrowLeft size={16} />
          {t('staff.backToDirectory')}
        </Link>

        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center sm:p-12">
            {portrait ? (
              <div className="flex flex-col items-center gap-2">
                <StockPhoto photo={portrait} compact isPersonPhoto className="h-40 w-40 rounded-full" imgClassName="rounded-full" />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {t('common.illustrativePhotoPerson')} · {t('common.photoCredit')}: {portrait.credit}
                </p>
              </div>
            ) : (
              <PlaceholderImage initials={initialsOf(pick(member, 'name', lang))} size="lg" variant="saffron" className="rounded-full" />
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">{pick(member, 'name', lang)}</h1>
              <p className="text-[hsl(var(--muted-foreground))]">{pick(member, 'designation', lang)}</p>
            </div>

            <dl className="grid w-full max-w-md grid-cols-1 gap-4 text-left sm:grid-cols-2">
              {member.subject_en && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{t('staff.subject')}</dt>
                  <dd className="text-[hsl(var(--foreground))]">{pick(member, 'subject', lang)}</dd>
                </div>
              )}
              {member.qualification && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{t('staff.qualification')}</dt>
                  <dd className="text-[hsl(var(--foreground))]">{member.qualification}</dd>
                </div>
              )}
            </dl>

            <div className="w-full border-t border-[hsl(var(--border))] pt-6 text-left">
              <h2 className="mb-2 font-semibold text-[hsl(var(--foreground))]">{t('staff.bio')}</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {pick(member, 'bio', lang) || t('staff.noBio')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}

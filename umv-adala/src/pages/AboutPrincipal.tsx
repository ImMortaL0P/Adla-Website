import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { school } from '@/data/school'
import { pick } from '@/lib/utils'

export default function AboutPrincipal() {
  const { t, lang } = useT()

  return (
    <>
      <Seo titleKey="about.principal.title" path="/about/principal" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: t('common.nav.aboutSchool'), href: '/about' }, { label: t('about.principal.title') }]} />
        <SectionHeading overline={t('about.principal.overline')} title={t('about.principal.title')} level={1} />
        <Reveal>
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center sm:p-12">
            <PlaceholderImage initials="P" size="lg" variant="leaf" className="rounded-full" />
            <div>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                {pick(school.principal, 'name', lang)}
              </h2>
              <p className="text-[hsl(var(--muted-foreground))]">{t('common.nav.principal')}</p>
            </div>
            <p className="max-w-2xl leading-relaxed text-[hsl(var(--muted-foreground))]">
              {lang === 'en'
                ? 'A full message from the Principal — reflecting on the school’s values, its commitment to every student, and a welcome to families in the community — will be published here once provided by the school administration.'
                : 'प्रधानाचार्य का पूरा संदेश — विद्यालय के मूल्यों, प्रत्येक विद्यार्थी के प्रति प्रतिबद्धता एवं समुदाय के परिवारों का स्वागत करते हुए — विद्यालय प्रशासन द्वारा उपलब्ध कराए जाने पर यहाँ प्रकाशित किया जाएगा।'}
            </p>
            <span className="rounded-full bg-[hsl(var(--muted))] px-4 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
              {t('common.placeholder')}
            </span>
          </div>
        </Reveal>
      </div>
    </>
  )
}

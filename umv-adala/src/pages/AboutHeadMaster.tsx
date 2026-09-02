import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { StockPhoto } from '@/components/common/StockPhoto'
import { school } from '@/data/school'
import { staffPortraits } from '@/data/stockPhotos'
import { pick } from '@/lib/utils'
import { useImages } from '@/hooks/useImages'

export default function AboutHeadMaster() {
  const { t, lang } = useT()
  const { getSystemImage } = useImages()
  const dynamicPhoto = getSystemImage('headmaster_photo')

  return (
    <>
      <Seo titleKey="about.headMaster.title" path="/about/headMaster" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: t('common.nav.aboutSchool'), href: '/about' }, { label: t('about.headMaster.title') }]} />
        <SectionHeading overline={t('about.headMaster.overline')} title={t('about.headMaster.title')} level={1} />
        <Reveal>
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center sm:p-12">
            <div className="flex flex-col items-center gap-2">
              {dynamicPhoto ? (
                <img src={dynamicPhoto} alt="Headmaster" className="h-40 w-40 rounded-full object-cover" />
              ) : (
                <>
                  <StockPhoto photo={staffPortraits.headMaster} compact isPersonPhoto className="h-40 w-40 rounded-full" imgClassName="rounded-full" />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t('common.illustrativePhotoPerson')} · {t('common.photoCredit')}: {staffPortraits.headMaster.credit}
                  </p>
                </>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                {pick(school.headMaster, 'name', lang)}
              </h2>
              <p className="text-[hsl(var(--muted-foreground))]">{t('common.nav.headMaster')}</p>
            </div>
            <p className="max-w-2xl leading-relaxed text-[hsl(var(--muted-foreground))]">
              {lang === 'en'
                ? 'A full message from the Head Master — reflecting on the school’s values, its commitment to every student, and a welcome to families in the community — will be published here once provided by the school administration.'
                : 'प्रधानाध्यापक का पूरा संदेश — विद्यालय के मूल्यों, प्रत्येक विद्यार्थी के प्रति प्रतिबद्धता एवं समुदाय के परिवारों का स्वागत करते हुए — विद्यालय प्रशासन द्वारा उपलब्ध कराए जाने पर यहाँ प्रकाशित किया जाएगा।'}
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

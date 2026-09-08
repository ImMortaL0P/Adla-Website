import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/motion/Reveal'
import { school } from '@/data/school'
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
                <div className="h-40 w-40 rounded-full bg-[hsl(var(--border))] flex items-center justify-center text-4xl font-bold text-[hsl(var(--muted-foreground))]">
                   HM
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                {pick(school.headMaster, 'name', lang)}
              </h2>
              <p className="text-[hsl(var(--muted-foreground))]">{t('common.nav.headMaster')}</p>
            </div>
            <div className="max-w-2xl space-y-4 text-left leading-relaxed text-[hsl(var(--muted-foreground))]">
              {lang === 'en' ? (
                <>
                  <p>
                    It gives me immense pleasure to welcome you to our school. Our school is not merely a place of academic learning, it is a place where adolescent minds are nurtured, values are developed, and confidence is built.
                  </p>
                  <p>
                    We believe that every child is unique and has the potential to achieve great things. Our aim is to provide a safe, inclusive and inspiring environment where students can learn, explore, think independently and develop their talents.
                  </p>
                  <p>
                    I sincerely appreciate the cooperation of parents, teachers and students in building a strong school community. Together, we are committed to creating a brighter future for the children.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    आप सभी का हमारे विद्यालय में स्वागत करते हुए मुझे अत्यंत हर्ष हो रहा है। हमारा विद्यालय केवल शैक्षणिक ज्ञान का केंद्र नहीं है, बल्कि यह एक ऐसा स्थान है जहाँ किशोर मन को पोषित किया जाता है, मूल्यों का विकास किया जाता है, और आत्मविश्वास का निर्माण होता है।
                  </p>
                  <p>
                    हमारा विश्वास है कि प्रत्येक बच्चा अद्वितीय है और उसमें महान उपलब्धियां हासिल करने की क्षमता है। हमारा उद्देश्य एक सुरक्षित, समावेशी और प्रेरणादायक वातावरण प्रदान करना है जहाँ छात्र स्वतंत्र रूप से सीख सकें, अन्वेषण कर सकें, विचार कर सकें और अपनी प्रतिभा का विकास कर सकें।
                  </p>
                  <p>
                    एक सशक्त विद्यालय समुदाय के निर्माण में अभिभावकों, शिक्षकों और छात्रों के सहयोग की मैं हृदय से सराहना करता हूँ। हम सब मिलकर बच्चों के लिए एक उज्ज्वल भविष्य बनाने के लिए प्रतिबद्ध हैं।
                  </p>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}

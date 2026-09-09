import { ProtectedImage } from "@/components/common/ProtectedImage"
import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { school } from '@/data/school'
import { useImages } from '@/hooks/useImages'
import { pick } from '@/lib/utils'

export function HeadMasterMessage() {
  const { t, lang } = useT()
  const { getSystemImage } = useImages()

  const dynamicHeadmasterPhoto = getSystemImage('headmaster_photo')

  return (
    <section className="bg-[hsl(var(--muted))]/50 py-16">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
        <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
          {t('home.headMaster.title')}
        </h2>
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            {dynamicHeadmasterPhoto ? (
              <ProtectedImage src={dynamicHeadmasterPhoto} alt="Headmaster" containerClassName="h-24 w-24 shrink-0 overflow-hidden rounded-full" className="h-full w-full object-cover" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[hsl(var(--border))] flex items-center justify-center text-3xl font-bold text-[hsl(var(--muted-foreground))]">
                 HM
              </div>
            )}
            <Quote size={28} className="text-[hsl(var(--primary-strong))]/40" aria-hidden="true" />
            <p className="font-display text-xl italic leading-relaxed text-[hsl(var(--foreground))] sm:text-2xl">
              {lang === 'en'
                ? '“It gives me immense pleasure to welcome you to our school. Our school is not merely a place of academic learning, it is a place where adolescent minds are nurtured, values are developed, and confidence is built.”'
                : '“आप सभी का हमारे विद्यालय में स्वागत करते हुए मुझे अत्यंत हर्ष हो रहा है। हमारा विद्यालय केवल शैक्षणिक ज्ञान का केंद्र नहीं है, बल्कि यह एक ऐसा स्थान है जहाँ किशोर मन को पोषित किया जाता है, मूल्यों का विकास किया जाता है, और आत्मविश्वास का निर्माण होता है।”'}
            </p>
            <div>
              <p className="font-semibold text-[hsl(var(--foreground))]">{pick(school.headMaster, 'name', lang)}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('common.nav.headMaster')}</p>
            </div>
            <Link
              to="/about/headMaster"
              className="text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
            >
              {t('home.headMaster.readFull')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

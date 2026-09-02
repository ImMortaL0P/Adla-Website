import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { StockPhoto } from '@/components/common/StockPhoto'
import { school } from '@/data/school'
import { staffPortraits } from '@/data/stockPhotos'
import { useImages } from '@/hooks/useImages'
import { pick } from '@/lib/utils'

export function HeadMasterMessage() {
  const { t, lang } = useT()
  const { getSystemImage } = useImages()

  const dynamicHeadmasterPhoto = getSystemImage('headmaster_photo')

  return (
    <section className="bg-[hsl(var(--muted))]/50 py-16">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
        <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary-strong))]">
          {t('home.headMaster.overline')}
        </span>
        <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
          {t('home.headMaster.title')}
        </h2>
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            {dynamicHeadmasterPhoto ? (
              <img src={dynamicHeadmasterPhoto} alt="Headmaster" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <StockPhoto photo={staffPortraits.headMaster} compact isPersonPhoto className="h-24 w-24 rounded-full" imgClassName="rounded-full" />
            )}
            <Quote size={28} className="text-[hsl(var(--primary-strong))]/40" aria-hidden="true" />
            <p className="font-display text-xl italic leading-relaxed text-[hsl(var(--foreground))] sm:text-2xl">
              {lang === 'en'
                ? '“Every child who walks through our gates deserves care, encouragement, and the chance to learn well. This message will be updated by our Head Master soon.”'
                : '"हमारे द्वार से आने वाला प्रत्येक बच्चा देखभाल, प्रोत्साहन एवं अच्छी शिक्षा पाने का हकदार है। यह संदेश शीघ्र ही हमारे प्रधानाध्यापक द्वारा अद्यतन किया जाएगा।"'}
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

import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { PlaceholderImage } from '@/components/common/PlaceholderImage'
import { school } from '@/data/school'
import { pick } from '@/lib/utils'

export function PrincipalMessage() {
  const { t, lang } = useT()

  return (
    <section className="bg-[hsl(var(--muted))/50] py-16">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
        <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary-strong))]">
          {t('home.principal.overline')}
        </span>
        <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
          {t('home.principal.title')}
        </h2>
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            <PlaceholderImage initials="P" size="lg" variant="leaf" className="rounded-full" />
            <Quote size={28} className="text-[hsl(var(--primary-strong))/40]" aria-hidden="true" />
            <p className="font-display text-xl italic leading-relaxed text-[hsl(var(--foreground))] sm:text-2xl">
              {lang === 'en'
                ? '“Every child who walks through our gates deserves care, encouragement, and the chance to learn well. This message will be updated by our Principal soon.”'
                : '"हमारे द्वार से आने वाला प्रत्येक बच्चा देखभाल, प्रोत्साहन एवं अच्छी शिक्षा पाने का हकदार है। यह संदेश शीघ्र ही हमारे प्रधानाचार्य द्वारा अद्यतन किया जाएगा।"'}
            </p>
            <div>
              <p className="font-semibold text-[hsl(var(--foreground))]">{pick(school.principal, 'name', lang)}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('common.nav.principal')}</p>
            </div>
            <Link
              to="/about/principal"
              className="text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
            >
              {t('home.principal.readFull')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

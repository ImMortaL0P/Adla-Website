import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'

export function AdmissionCta() {
  const { t } = useT()

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-[hsl(var(--primary-strong))] px-6 py-14 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[hsl(var(--primary-foreground))] sm:text-4xl">
            {t('home.admission.title')}
          </h2>
          <p className="max-w-xl text-[hsl(var(--primary-foreground))/90]">{t('home.admission.description')}</p>
          <Link
            to="/admission"
            className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--card))] px-8 py-4 font-medium text-[hsl(var(--foreground))] shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--card))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--primary-strong))]"
          >
            {t('home.admission.cta')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

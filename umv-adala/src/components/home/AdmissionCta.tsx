import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'

export function AdmissionCta() {
  const { t } = useT()

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <Reveal>
        <div className="relative isolate grid grid-cols-1 overflow-hidden rounded-3xl bg-[hsl(var(--primary-strong))]">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--primary-strong))] to-[hsl(var(--primary))] opacity-80" />

          {/* Content */}
          <div className="relative flex flex-col justify-center gap-6 px-6 py-14 sm:px-12 lg:px-16 lg:py-20 text-center items-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[hsl(var(--primary-foreground))] sm:text-4xl lg:text-5xl">
              {t('home.admission.title')}
            </h2>
            <p className="max-w-xl text-lg text-[hsl(var(--primary-foreground))]/90">{t('home.admission.description')}</p>
            <div>
              <Link
                to="/admission"
                className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--card))] px-8 py-4 font-medium text-[hsl(var(--foreground))] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--card))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--primary-strong))]"
              >
                {t('home.admission.cta')}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}


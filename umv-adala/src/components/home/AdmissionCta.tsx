import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { stockPhotos } from '@/data/stockPhotos'

export function AdmissionCta() {
  const { t, lang } = useT()
  const bgPhoto = stockPhotos.eventSchoolUniformWalk

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <Reveal>
        <div className="relative isolate grid grid-cols-1 gap-8 overflow-hidden rounded-3xl bg-[hsl(var(--primary-strong))] lg:grid-cols-2 lg:gap-0">
          {/* Faded illustrative photo - only visible on desktop, positioned on right half */}
          <div className="absolute inset-0 -z-10 lg:left-1/2">
            <img
              src={bgPhoto.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-full w-full object-cover opacity-30 lg:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-strong))]/95 via-[hsl(var(--primary-strong))]/85 to-[hsl(var(--primary-strong))]/70 lg:from-transparent lg:via-[hsl(var(--primary-strong))]/60 lg:to-[hsl(var(--primary-strong))]/40" />
            <span className="sr-only">{bgPhoto.alt[lang]}</span>
          </div>
          <div
            title={`${t('common.illustrativePhoto')} — ${t('common.photoCredit')}: ${bgPhoto.credit}`}
            className="absolute bottom-3 right-3 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm"
          >
            {t('common.illustrativePhoto')}
          </div>

          {/* Content - left-aligned on desktop */}
          <div className="relative flex flex-col justify-center gap-6 px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
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

          {/* Spacer for image on desktop - keeps layout balanced */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </Reveal>
    </section>
  )
}

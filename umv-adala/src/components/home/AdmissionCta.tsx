import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Reveal } from '@/components/motion/Reveal'
import { stockPhotos } from '@/data/stockPhotos'

export function AdmissionCta() {
  const { t, lang } = useT()
  const bgPhoto = stockPhotos.eventSchoolUniformWalk

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
      <Reveal>
        <div className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-[hsl(var(--primary-strong))] px-6 py-14 text-center sm:px-16">
          {/* Faded illustrative photo + gradient overlay */}
          <div className="absolute inset-0 -z-10">
            <img
              src={bgPhoto.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-strong))]/90 via-[hsl(var(--primary-strong))]/80 to-[hsl(var(--primary-strong))]/60" />
            <span className="sr-only">{bgPhoto.alt[lang]}</span>
          </div>
          <div
            title={`${t('common.illustrativePhoto')} — ${t('common.photoCredit')}: ${bgPhoto.credit}`}
            className="absolute bottom-3 right-3 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm"
          >
            {t('common.illustrativePhoto')}
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-[hsl(var(--primary-foreground))] sm:text-4xl">
            {t('home.admission.title')}
          </h2>
          <p className="max-w-xl text-[hsl(var(--primary-foreground))]/90">{t('home.admission.description')}</p>
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

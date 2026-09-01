import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Phone, Mail, Clock, ExternalLink, Send } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { school } from '@/data/school'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

const inputClass = cn(
  'w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
)

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-[hsl(var(--foreground))]">{label}</span>
      {children}
    </label>
  )
}

export default function Contact() {
  const { t, lang } = useT()
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`)
    const mailto = `mailto:${school.email}?subject=${encodeURIComponent(values.subject)}&body=${body}`
    window.open(mailto, '_self')
    setSent(true)
  }

  const { lat, lng } = school.coordinates
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`

  return (
    <>
      <Seo titleKey="contact.title" path="/contact" />
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('contact.overline')} title={t('contact.title')} level={1} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal direction="left" className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <dl className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[hsl(var(--primary-strong))]" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{t('footer.address')}</dt>
                    <dd className="text-[hsl(var(--foreground))]">{school.address[lang]}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-[hsl(var(--primary-strong))]" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{t('footer.phone')}</dt>
                    <dd>
                      <a href={`tel:${school.phone.replace(/[^0-9+]/g, '')}`} className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary-strong))] hover:underline">
                        {school.phone}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-[hsl(var(--primary-strong))]" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{t('footer.email')}</dt>
                    <dd>
                      <a href={`mailto:${school.email}`} className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary-strong))] hover:underline">
                        {school.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-[hsl(var(--primary-strong))]" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{t('footer.officeHours')}</dt>
                    <dd className="text-[hsl(var(--foreground))]">{school.officeHours[lang]}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))]">
              <iframe title="School location map" src={embedUrl} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline"
            >
              {t('home.location.directions')}
              <ExternalLink size={14} />
            </a>
          </Reveal>

          <Reveal direction="right">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              {sent && (
                <p className="rounded-xl bg-[hsl(var(--success))]/12 px-4 py-3 text-sm text-[hsl(var(--success))]">
                  {t('admission.form.success')}
                </p>
              )}
              <Field label={t('contact.form.name')}>
                <input {...register('name')} required className={inputClass} />
              </Field>
              <Field label={t('contact.form.email')}>
                <input {...register('email')} type="email" required className={inputClass} />
              </Field>
              <Field label={t('contact.form.subject')}>
                <input {...register('subject')} required className={inputClass} />
              </Field>
              <Field label={t('contact.form.message')}>
                <textarea {...register('message')} rows={5} required className={inputClass} />
              </Field>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary-strong))] px-8 py-3.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary-strong))]/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              >
                <Send size={16} />
                {t('contact.form.submit')}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </>
  )
}

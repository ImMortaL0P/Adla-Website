import { useState, type ReactNode, useMemo } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, MessageCircle, Send } from 'lucide-react'
import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SectionNav } from '@/components/common/SectionNav'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { admissionContent as staticAdmissionContent } from '@/data/content'
import { school } from '@/data/school'
import { cn } from '@/lib/utils'
import { useContent } from '@/hooks/useContent'

const classOptions = ['9', '10', '11', '12']

function buildSchema(t: (key: string) => string) {
  return z.object({
    studentName: z.string().min(1, t('admission.form.validation.nameRequired')),
    guardianName: z.string().optional(),
    phone: z
      .string()
      .min(1, t('admission.form.validation.phoneRequired'))
      .regex(/^[6-9]\d{9}$/, t('admission.form.validation.phoneInvalid')),
    email: z.string().email(t('admission.form.validation.emailInvalid')).optional().or(z.literal('')),
    classApplying: z.string().optional(),
    message: z.string().optional(),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export default function Admission() {
  const { t, lang } = useT()
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const { getValue } = useContent()

  const admissionContent = useMemo(() => {
    const raw = getValue('admission_content', 'en', '');
    if (!raw) return staticAdmissionContent;
    try {
      return JSON.parse(raw);
    } catch {
      return staticAdmissionContent;
    }
  }, [getValue]);

  const schema = buildSchema(t as (key: string) => string)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setSubmitted(values)
    reset()
  }

  const whatsappNumber = school.phone.replace(/[^0-9]/g, '')
  const whatsappMessage = submitted
    ? encodeURIComponent(
        `${t('admission.form.title')}\n${t('admission.form.studentName')}: ${submitted.studentName}\n${t('admission.form.guardianName')}: ${
          submitted.guardianName || '-'
        }\n${t('admission.form.phone')}: ${submitted.phone}\n${t('admission.form.class')}: ${submitted.classApplying || '-'}\n${
          t('admission.form.message')
        }: ${submitted.message || '-'}`
      )
    : ''
  const mailtoHref = submitted
    ? `mailto:${school.email}?subject=${encodeURIComponent(t('admission.form.title'))}&body=${whatsappMessage}`
    : '#'

  return (
    <>
      <Seo titleKey="admission.title" path="/admission" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('admission.overline')} title={t('admission.title')} level={1} />

        <SectionNav
          items={[
            { id: 'process', label: t('admission.process') },
            { id: 'eligibility', label: t('admission.eligibility') },
            { id: 'documents', label: t('admission.documents') },
            { id: 'fees', label: t('admission.fees') },
            { id: 'dates', label: t('admission.dates') },
            { id: 'faq', label: t('admission.faq') },
            { id: 'enquiry', label: t('admission.form.title') },
          ]}
        />

        {/* Process */}
        <Reveal>
          <section id="process" className="mb-14 scroll-mt-32">
            <h2 className="mb-6 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.process')}</h2>
            <StaggerGroup stagger={70} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {admissionContent.process.map((step: any, i: number) => (
                <Reveal key={i}>
                  <div className="flex items-start gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary-strong))] text-sm font-semibold text-[hsl(var(--primary-foreground))]">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[hsl(var(--foreground))]">{step[lang]}</p>
                  </div>
                </Reveal>
              ))}
            </StaggerGroup>
          </section>
        </Reveal>

        {/* Eligibility */}
        <Reveal>
          <section id="eligibility" className="mb-14 scroll-mt-32">
            <h2 className="mb-6 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.eligibility')}</h2>
            <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[hsl(var(--muted))]">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-[hsl(var(--foreground))]">
                      {t('admission.eligibility.classLabel')}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-[hsl(var(--foreground))]">
                      {t('admission.eligibility')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admissionContent.eligibility.map((row: any) => (
                    <tr key={row.classRange} className="border-t border-[hsl(var(--border))]">
                      <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{row.classRange}</td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{row[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        {/* Documents */}
        <Reveal>
          <section id="documents" className="mb-14 scroll-mt-32">
            <h2 className="mb-6 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.documents')}</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {admissionContent.documents.map((doc: any, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--foreground))]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary-strong))]" />
                  {doc[lang]}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Fees */}
        <Reveal>
          <section id="fees" className="mb-14 scroll-mt-32">
            <h2 className="mb-4 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.fees')}</h2>
            <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="w-full text-left text-sm">
                <tbody>
                  {admissionContent.feeRows.map((row: any) => (
                    <tr key={row.head_en} className="border-t border-[hsl(var(--border))] first:border-t-0">
                      <th scope="row" className="bg-[hsl(var(--muted))] px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                        {lang === 'en' ? row.head_en : row.head_hi}
                      </th>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{lang === 'en' ? row.value_en : row.value_hi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        {/* Important Dates */}
        <Reveal>
          <section id="dates" className="mb-14 scroll-mt-32">
            <h2 className="mb-6 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.dates')}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {admissionContent.importantDates.map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3">
                  <span className="text-sm text-[hsl(var(--foreground))]">{lang === 'en' ? d.label_en : d.label_hi}</span>
                  <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{d.date}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section id="faq" className="mb-14 scroll-mt-32">
            <h2 className="mb-6 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.faq')}</h2>
            <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
              {admissionContent.faq.map((item: any, i: number) => (
                <Accordion.Item
                  key={i}
                  value={`item-${i}`}
                  className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]">
                      {lang === 'en' ? item.q_en : item.q_hi}
                      <ChevronDown size={16} className="shrink-0 text-[hsl(var(--muted-foreground))] transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-4 pb-4 text-sm text-[hsl(var(--muted-foreground))] data-[state=open]:animate-in data-[state=open]:fade-in-0">
                    {lang === 'en' ? item.a_en : item.a_hi}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </section>
        </Reveal>

        {/* Enquiry Form */}
        <Reveal>
          <section id="enquiry" className="scroll-mt-32 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-10">
            <h2 className="mb-6 font-display text-xl font-semibold text-[hsl(var(--foreground))]">{t('admission.form.title')}</h2>

            {submitted ? (
              <div className="flex flex-col gap-4">
                <p className="rounded-xl bg-[hsl(var(--success))]/12 px-4 py-3 text-sm text-[hsl(var(--success))]">
                  {t('admission.form.success')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--secondary-strong))] px-5 py-3 text-sm font-medium text-[hsl(var(--secondary-foreground))] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                  >
                    <MessageCircle size={16} />
                    {t('admission.form.whatsapp')}
                  </a>
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                  >
                    <Send size={16} />
                    {t('contact.form.submit')}
                  </a>
                </div>
                <button
                  onClick={() => setSubmitted(null)}
                  className="w-fit text-sm font-medium text-[hsl(var(--primary-strong))] hover:underline"
                >
                  {t('admission.form.title')} →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={t('admission.form.studentName')} error={errors.studentName?.message}>
                  <input {...register('studentName')} className={inputClass} />
                </Field>
                <Field label={t('admission.form.guardianName')} error={errors.guardianName?.message}>
                  <input {...register('guardianName')} className={inputClass} />
                </Field>
                <Field label={t('admission.form.phone')} error={errors.phone?.message}>
                  <input {...register('phone')} type="tel" inputMode="numeric" className={inputClass} />
                </Field>
                <Field label={t('admission.form.email')} error={errors.email?.message}>
                  <input {...register('email')} type="email" className={inputClass} />
                </Field>
                <Field label={t('admission.form.class')} error={undefined}>
                  <select {...register('classApplying')} className={inputClass}>
                    <option value="">—</option>
                    {classOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t('admission.form.message')} error={undefined} className="sm:col-span-2">
                  <textarea {...register('message')} rows={4} className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary-strong))] px-8 py-3.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary-strong))]/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
                  >
                    {isSubmitting ? t('admission.form.submitting') : t('admission.form.submit')}
                  </button>
                </div>
              </form>
            )}
          </section>
        </Reveal>
      </div>
    </>
  )
}

const inputClass = cn(
  'w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
)

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5 text-sm', className)}>
      <span className="font-medium text-[hsl(var(--foreground))]">{label}</span>
      {children}
      {error && <span className="text-xs text-[hsl(var(--destructive))]">{error}</span>}
    </label>
  )
}

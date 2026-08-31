import { useT } from '@/context/LanguageContext'
import { Seo } from '@/components/common/Seo'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { disclosureSections } from '@/data/content'

export default function MandatoryDisclosure() {
  const { t, lang } = useT()

  return (
    <>
      <Seo titleKey="disclosure.title" path="/mandatory-disclosure" />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12">
        <SectionHeading overline={t('disclosure.overline')} title={t('disclosure.title')} alignment="left" level={1} />

        <Reveal>
          <p className="mb-10 rounded-xl bg-[hsl(var(--muted))/50] px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
            {t('disclosure.pending')}
          </p>
        </Reveal>

        <div className="flex flex-col gap-10">
          {disclosureSections.map((section) => (
            <Reveal key={section.title_en}>
              <section>
                <h2 className="mb-4 font-display text-lg font-semibold text-[hsl(var(--foreground))]">
                  {lang === 'en' ? section.title_en : section.title_hi}
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {section.rows.map((row) => (
                        <tr key={row.label_en} className="border-t border-[hsl(var(--border))] first:border-t-0">
                          <th scope="row" className="w-1/2 bg-[hsl(var(--muted))] px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                            {lang === 'en' ? row.label_en : row.label_hi}
                          </th>
                          <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}

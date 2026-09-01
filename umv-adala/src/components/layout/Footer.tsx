import { Link } from 'react-router-dom'
import { SchoolCrest } from '@/components/common/SchoolCrest'
import { useT } from '@/context/LanguageContext'
import { school } from '@/data/school'
import { pick } from '@/lib/utils'

export function Footer() {
  const { t, lang } = useT()

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Identity */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded-lg w-fit">
              <SchoolCrest size={48} />
              <div>
                <h3 className="font-display text-lg font-bold leading-tight">
                  {t('common.schoolNameFull')}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {t('common.tagline')}
                </p>
                <p className="mt-1 text-xs italic text-[hsl(var(--muted-foreground))]">
                  {t('common.motto')}
                </p>
              </div>
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {t('footer.address')}:<br />
              {pick(school, 'address', lang)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-[hsl(var(--foreground))]">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link to="/about" className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {t('common.nav.aboutSchool')}
                </Link>
              </li>
              <li>
                <Link to="/admission" className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {t('common.nav.admission')}
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {t('common.nav.notices')}
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {t('common.nav.downloads')}
                </Link>
              </li>
              <li>
                <Link to="/mandatory-disclosure" className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {t('common.nav.mandatoryDisclosure')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-[hsl(var(--foreground))]">{t('footer.contactUs')}</h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <span className="block font-medium text-[hsl(var(--foreground))]">{t('footer.phone')}</span>
                <a href={`tel:${school.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {school.phone}
                </a>
              </li>
              <li>
                <span className="block font-medium text-[hsl(var(--foreground))]">{t('footer.email')}</span>
                <a href={`mailto:${school.email}`} className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  {school.email}
                </a>
              </li>
              <li>
                <span className="block font-medium text-[hsl(var(--foreground))]">{t('footer.officeHours')}</span>
                {pick(school, 'officeHours', lang)}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[hsl(var(--border))] pt-8 sm:flex-row">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {t('common.copyright')}
          </p>
          <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
            {t('common.govAttribution')}
          </p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { SchoolLogo } from '@/components/common/SchoolLogo'
import { useT } from '@/context/LanguageContext'
import { school } from '@/data/school'

export function Footer() {
  const { t, lang } = useT()

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Identity */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded-lg w-fit">
              <SchoolLogo className="h-40" />
              <div>
                <h3 className="font-display text-lg font-bold leading-tight">
                  {t('common.schoolNameFull')}
                </h3>
                <p className="mt-1 text-xs italic text-[hsl(var(--muted-foreground))]">
                  {t('common.motto')}
                </p>
              </div>
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {t('footer.address')}:<br />
              {school.address[lang]}
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
              <li>
                <Link to="/admin" className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                  Admin Portal
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
                {school.email.split(',').map((email) => (
                  <span key={email.trim()} className="block">
                    <a href={`mailto:${email.trim()}`} className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                      {email.trim()}
                    </a>
                  </span>
                ))}
              </li>
              <li>
                <span className="block font-medium text-[hsl(var(--foreground))]">{t('footer.officeHours')}</span>
                {school.officeHours[lang]}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[hsl(var(--border))] pt-8 sm:flex-row sm:gap-4">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {t('common.copyright')}
          </p>
          <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
            {t('common.govAttribution')}
          </p>
        </div>
        <div className="mt-3 flex justify-center sm:justify-end">
          <a
            href="https://www.linkedin.com/in/kumar-mangalam-362a77176/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded"
          >
            {t('common.developedBy')} Kumar Mangalam
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

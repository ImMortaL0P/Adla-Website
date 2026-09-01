import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SchoolLogo } from '@/components/common/SchoolLogo'
import { useTheme } from '@/context/ThemeContext'
import { useT } from '@/context/LanguageContext'
import { MobileNav } from './MobileNav'

const navItems = [
  {
    labelKey: 'common.nav.about',
    href: '/about',
    children: [
      { labelKey: 'common.nav.aboutSchool', href: '/about' },
      { labelKey: 'common.nav.headMaster', href: '/about/headMaster' },
      { labelKey: 'common.nav.infrastructure', href: '/about/infrastructure' },
    ],
  },
  {
    labelKey: 'common.nav.academics',
    href: '/academics',
    children: [
      { labelKey: 'common.nav.academicsOverview', href: '/academics' },
      { labelKey: 'common.nav.secondary', href: '/academics/secondary' },
      { labelKey: 'common.nav.senior', href: '/academics/senior' },
    ],
  },
  { labelKey: 'common.nav.staff', href: '/staff' },
  { labelKey: 'common.nav.gallery', href: '/gallery' },
  { labelKey: 'common.nav.notices', href: '/notices' },
  { labelKey: 'common.nav.results', href: '/results' },
  { labelKey: 'common.nav.admission', href: '/admission' },
  { labelKey: 'common.nav.contact', href: '/contact' },
] as const

export type NavItem = (typeof navItems)[number]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  const label = theme === 'light' ? 'Switch to dark mode' : theme === 'dark' ? 'Switch to system theme' : 'Switch to light mode'

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      aria-pressed={theme === 'dark'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg',
        'text-white dark:text-[hsl(var(--foreground))] hover:bg-black/10 dark:hover:bg-black/10 dark:bg-[hsl(var(--muted))]',
        'transition-colors duration-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2'
      )}
    >
      <Icon size={20} strokeWidth={1.75} />
    </button>
  )
}

function LanguageToggle() {
  const { lang, toggleLang } = useT()

  return (
    <button
      onClick={toggleLang}
      aria-label={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
      className={cn(
        'flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium',
        'text-white dark:text-[hsl(var(--foreground))] hover:bg-black/10 dark:hover:bg-black/10 dark:bg-[hsl(var(--muted))]',
        'transition-colors duration-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2'
      )}
    >
      <span className={cn(lang === 'en' && 'text-[hsl(var(--saffron))] font-semibold')}>EN</span>
      <span className="text-white/80 dark:text-[hsl(var(--muted-foreground))]">|</span>
      <span className={cn(lang === 'hi' && 'text-[hsl(var(--saffron))] font-semibold')}>हिं</span>
    </button>
  )
}

function DropdownNav({ item }: { item: NavItem & { children: ReadonlyArray<{ labelKey: string; href: string }> } }) {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const location = useLocation()

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium',
          'text-white dark:text-[hsl(var(--foreground))] hover:bg-black/10 dark:hover:bg-black/10 dark:bg-[hsl(var(--muted))]',
          'transition-colors duration-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
        )}
      >
        {t(item.labelKey as any)}
        <svg
          className={cn('h-3.5 w-3.5 transition-transform duration-700', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          'absolute left-0 top-full z-50 mt-1 min-w-[200px] origin-top rounded-xl',
          'border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
          'p-1.5 shadow-md',
          'transition-[opacity,transform] duration-600',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        )}
        aria-hidden={!open}
      >
        {item.children.map((child) => (
          <Link
            key={child.href}
            to={child.href}
            tabIndex={open ? 0 : -1}
            className={cn(
              'block rounded-lg px-3 py-2 text-sm',
              'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
              'transition-colors duration-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
              location.pathname === child.href && 'bg-[hsl(var(--muted))] font-medium'
            )}
          >
            {t(child.labelKey as any)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const { t } = useT()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-700',
        scrolled
          ? 'border-b border-[hsl(var(--border))] bg-[hsl(var(--primary-strong))] dark:bg-[hsl(var(--background))]/85 backdrop-blur-md text-white dark:text-foreground'
          : 'bg-[hsl(var(--primary-strong))] dark:bg-[hsl(var(--background))]/70 backdrop-blur-sm'
      )}
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo / School name — the crest is deliberately taller than the
            band and top-aligned so it reads as a badge pasted over the
            seam between the nav bar and the page below, while the band
            itself stays a normal, menu-height strip. */}
        <Link
          to="/"
          className={cn(
            'z-10 flex items-start gap-3 self-start pt-1.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded-lg'
          )}
        >
          <SchoolLogo className="h-32 shadow-xl" />
          <div className="hidden mt-3 sm:block">
            <div className="text-lg font-semibold leading-tight text-white dark:text-[hsl(var(--foreground))]">
              {t('common.schoolName')}
            </div>
            <div className="text-sm leading-tight text-white/80 dark:text-[hsl(var(--muted-foreground))]">
              {t('common.schoolNameHi')}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1" aria-label="Main navigation">
          {navItems.map((item) =>
            'children' in item ? (
              <DropdownNav key={item.href} item={item} />
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  'text-white dark:text-[hsl(var(--foreground))] hover:bg-black/10 dark:hover:bg-black/10 dark:bg-[hsl(var(--muted))]',
                  'transition-colors duration-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                  location.pathname === item.href && 'bg-black/10 dark:bg-[hsl(var(--muted))]'
                )}
              >
                {t(item.labelKey as any)}
              </Link>
            )
          )}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageToggle />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label={t('common.openMenu')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg lg:hidden',
              'text-white dark:text-[hsl(var(--foreground))] hover:bg-black/10 dark:hover:bg-black/10 dark:bg-[hsl(var(--muted))]',
              'transition-colors duration-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
            )}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />
    </header>
  )
}

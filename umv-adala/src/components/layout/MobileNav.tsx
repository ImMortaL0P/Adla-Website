import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/context/LanguageContext'
import type { NavItem } from './Header'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  navItems: readonly NavItem[]
}

export function MobileNav({ open, onClose, navItems }: MobileNavProps) {
  const { t } = useT()
  const location = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  
  // Track expanded state of dropdowns
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Close on route change
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  const toggleExpand = (href: string) => {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm',
          'flex flex-col bg-[hsl(var(--background))] shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-[hsl(var(--border))]">
          <span className="font-semibold">{t('common.nav.home')}</span>
          <button
            onClick={onClose}
            aria-label={t('common.closeMenu')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg -mr-2',
              'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
            )}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item, i) => {
              const isDropdown = 'children' in item
              const isExpanded = expanded[item.href]

              return (
                <li
                  key={item.href}
                  className="animate-in slide-in-from-right-4 fade-in-0 fill-mode-backwards"
                  style={{ animationDelay: `${i * 50}ms`, animationDuration: '300ms' }}
                >
                  {isDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.href)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-4 py-3 text-lg font-medium',
                          'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]'
                        )}
                      >
                        {t(item.labelKey as any)}
                        <ChevronDown
                          size={20}
                          className={cn('transition-transform', isExpanded && 'rotate-180')}
                        />
                      </button>
                      
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-300 ease-in-out',
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        <ul className="mt-1 space-y-1 pl-4 pr-2 border-l-2 border-[hsl(var(--muted))] ml-6">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                className={cn(
                                  'block rounded-lg px-4 py-2.5 text-base',
                                  'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                                  location.pathname === child.href && 'text-[hsl(var(--primary-strong))] font-medium'
                                )}
                              >
                                {t(child.labelKey as any)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        'block rounded-lg px-4 py-3 text-lg font-medium',
                        'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                        location.pathname === item.href && 'bg-[hsl(var(--muted))]'
                      )}
                    >
                      {t(item.labelKey as any)}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}

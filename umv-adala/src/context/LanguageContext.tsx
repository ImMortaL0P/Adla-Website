import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { translations, type TranslationKey } from '@/i18n/translations'
import type { Lang } from '@/i18n/types'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem('umv-lang')
      return stored === 'hi' ? 'hi' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.classList.toggle('lang-hi', lang === 'hi')
    try {
      localStorage.setItem('umv-lang', lang)
    } catch {
      // Ignore
    }
  }, [lang])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
  }

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'hi' : 'en'))
  }

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let str = translations[lang][key]
    
    // Fallback to English if somehow missing (though type system prevents this)
    if (!str) {
      str = translations.en[key]
    }
    
    // Safety check just in case
    if (!str) return key

    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, 'g'), String(v)),
        str
      )
    }
    return str
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useT() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useT must be used within a LanguageProvider')
  }
  return context
}

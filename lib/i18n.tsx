'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'zh';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const supportedLanguages: Language[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];

const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ja: '日本語',
  zh: '中文'
};

// Language detection based on browser and location
function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  // Check localStorage first
  const savedLang = localStorage.getItem('prepflow_language') as Language;
  if (savedLang && supportedLanguages.includes(savedLang)) {
    return savedLang;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0] as Language;
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }
  
  // Check for specific language codes
  const fullBrowserLang = navigator.language;
  if (fullBrowserLang.startsWith('zh')) return 'zh';
  if (fullBrowserLang.startsWith('ja')) return 'ja';
  if (fullBrowserLang.startsWith('pt')) return 'pt';
  if (fullBrowserLang.startsWith('it')) return 'it';
  if (fullBrowserLang.startsWith('de')) return 'de';
  if (fullBrowserLang.startsWith('fr')) return 'fr';
  if (fullBrowserLang.startsWith('es')) return 'es';
  
  // Default to English
  return 'en';
}

// Simple translation function (in a real app, you'd use a proper i18n library)
function translate(key: string, language: Language, params?: Record<string, string | number>): string {
  // This is a simplified version - in production, you'd load the actual translation files
  // For now, we'll return the key as a fallback
  return key;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const router = useRouter();
  const pathname = usePathname();

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/messages/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        if (language !== 'en') {
          const response = await fetch('/messages/en.json');
          const data = await response.json();
          setTranslations(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Detect language on mount
  useEffect(() => {
    const detectedLang = detectLanguage();
    setLanguageState(detectedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('prepflow_language', lang);
    
    // Update URL to include language if needed
    const currentPath = pathname;
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}\//, '/');
    const newPath = lang === 'en' ? pathWithoutLang : `/${lang}${pathWithoutLang}`;
    
    if (newPath !== currentPath) {
      router.push(newPath);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): any => {
    if (isLoading) return key;
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      // Replace parameters
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param]?.toString() || match;
        });
      }
      return value;
    }
    
    // Return the value as-is (could be string, array, object, etc.)
    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export { languageNames, supportedLanguages };
export type { Language };
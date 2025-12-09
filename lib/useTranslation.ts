'use client';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

// Available languages - Only English and German
export const availableLanguages = {
  'en-AU': { name: 'English', flag: '🇬🇧' },
  'de-DE': { name: 'Deutsch', flag: '🇩🇪' },
};

// Translation files mapping - lazy loaded
const translations: Record<string, any> = {};

// Lazy load translation files
async function loadTranslations(language: string) {
  if (translations[language]) {
    return translations[language];
  }

  try {
    if (language === 'en-AU') {
      const { translations: enAU } = await import('./translations/en-AU');
      translations['en-AU'] = enAU;
      return enAU;
    } else if (language === 'de-DE') {
      const { translations: deDE } = await import('./translations/de-DE');
      translations['de-DE'] = deDE;
      return deDE;
    }
  } catch (error) {
    logger.error(`Failed to load translations for ${language}:`, error);
  }
  if (!translations['en-AU']) {
    const { translations: enAU } = await import('./translations/en-AU');
    translations['en-AU'] = enAU;
  }
  return translations['en-AU'];
}

// Get browser language - Only English and German
// Wrapped in try-catch to handle HMR edge cases
function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en-AU';

  try {
    // Safely access navigator (may not be available during HMR)
    const browserLang = navigator?.language || 'en-AU';
    if (availableLanguages[browserLang as keyof typeof availableLanguages]) return browserLang;
    const langCode = browserLang.split('-')[0];
    if (langCode === 'de') return 'de-DE';
    return 'en-AU';
  } catch (error) {
    // Fallback during HMR or if navigator is unavailable
    // Silently fail during HMR to prevent console spam
    try {
      logger.warn('Failed to get browser language, using default:', error);
    } catch {
      // Ignore logger errors during HMR (logger may not be available)
    }
    return 'en-AU';
  }
}

// Get nested translation value
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Main translation hook
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en-AU');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        setIsClient(true);

        // Safely access localStorage (may not be available during HMR)
        let savedLanguage: string | null = null;
        try {
          savedLanguage =
            typeof window !== 'undefined' ? localStorage.getItem('prepflow_language') : null;
        } catch (error) {
          // Silently fail during HMR
          try {
            logger.warn('Failed to access localStorage:', error);
          } catch {
            // Ignore logger errors during HMR
          }
        }

        const browserLanguage = getBrowserLanguage();
        const language = savedLanguage || browserLanguage;

        setCurrentLanguage(language);

        // Load translations for the selected language
        await loadTranslations(language);
        setIsLoading(false);
      } catch (error) {
        // Handle HMR errors gracefully
        try {
          logger.error('Failed to initialize language:', error);
        } catch {
          // Ignore logger errors during HMR
        }
        setCurrentLanguage('en-AU');
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  // Get translation function
  const t = (key: string, fallback?: string | any[]): string | any[] => {
    const currentTranslations = translations[currentLanguage] || translations['en-AU'];
    const translation = getNestedValue(currentTranslations, key);
    if (translation !== undefined) return translation;
    return fallback || key;
  };

  // Change language
  const changeLanguage = async (language: string) => {
    if (availableLanguages[language as keyof typeof availableLanguages]) {
      try {
        setCurrentLanguage(language);
        // Safely access localStorage (may not be available during HMR)
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('prepflow_language', language);
          }
        } catch (error) {
          // Silently fail during HMR
          try {
            logger.warn('Failed to save language to localStorage:', error);
          } catch {
            // Ignore logger errors during HMR
          }
        }
        await loadTranslations(language);
        if (typeof window !== 'undefined') window.location.reload();
      } catch (error) {
        // Silently fail during HMR
        try {
          logger.error('Failed to change language:', error);
        } catch {
          // Ignore logger errors during HMR
        }
      }
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () =>
    availableLanguages[currentLanguage as keyof typeof availableLanguages] ||
    availableLanguages['en-AU'];

  // Get all available languages
  const getAvailableLanguages = () => {
    return Object.entries(availableLanguages).map(([code, info]) => ({
      code,
      ...info,
    }));
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    getAvailableLanguages,
    isLoading,
  };
}

// Utility function for components that need translation outside of hook
export async function getTranslation(key: string, language: string = 'en-AU'): Promise<string> {
  const currentTranslations = await loadTranslations(language);
  return getNestedValue(currentTranslations, key) || key;
}

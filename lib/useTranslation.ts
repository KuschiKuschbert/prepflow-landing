'use client';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  availableLanguages,
  getBrowserLanguage,
} from './useTranslation/helpers/getBrowserLanguage';
import { getNestedValue } from './useTranslation/helpers/getNestedValue';
import { getCachedTranslations, loadTranslations } from './useTranslation/helpers/loadTranslations';

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
  const t = useCallback(
    (key: string, fallback?: string | any[]): string | any[] => {
      const translations = getCachedTranslations();
      const currentTranslations = translations[currentLanguage] || translations['en-AU'];
      const translation = getNestedValue(currentTranslations, key);
      if (translation !== undefined) return translation;
      return fallback || key;
    },
    [currentLanguage],
  );

  // Change language
  const changeLanguage = useCallback(async (language: string) => {
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
  }, []);

  // Get current language info
  const getCurrentLanguageInfo = useCallback(
    () =>
      availableLanguages[currentLanguage as keyof typeof availableLanguages] ||
      availableLanguages['en-AU'],
    [currentLanguage],
  );

  // Get all available languages
  const getAvailableLanguages = useCallback(() => {
    return Object.entries(availableLanguages).map(([code, info]) => ({
      code,
      ...info,
    }));
  }, []);

  return useMemo(
    () => ({
      t,
      currentLanguage,
      changeLanguage,
      getCurrentLanguageInfo,
      getAvailableLanguages,
      isLoading,
    }),
    [t, currentLanguage, changeLanguage, getCurrentLanguageInfo, getAvailableLanguages, isLoading],
  );
}

// Utility function for components that need translation outside of hook
export async function getTranslation(key: string, language: string = 'en-AU'): Promise<string> {
  const currentTranslations = await loadTranslations(language);
  return getNestedValue(currentTranslations, key) || key;
}

// Re-export availableLanguages for convenience
export { availableLanguages };

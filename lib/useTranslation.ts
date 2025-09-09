'use client';

import { useState, useEffect } from 'react';

// Import all translation files
import { translations as enAU } from './translations/en-AU';
import { translations as deDE } from './translations/de-DE';

// Available languages
export const availableLanguages = {
  'en-AU': { name: 'English (Australia)', flag: '🇦🇺' },
  'en-US': { name: 'English (US)', flag: '🇺🇸' },
  'en-GB': { name: 'English (UK)', flag: '🇬🇧' },
  'de-DE': { name: 'Deutsch (Deutschland)', flag: '🇩🇪' },
  'fr-FR': { name: 'Français (France)', flag: '🇫🇷' },
  'es-ES': { name: 'Español (España)', flag: '🇪🇸' }
};

// Translation files mapping
const translations = {
  'en-AU': enAU,
  'en-US': enAU, // Fallback to AU for now
  'en-GB': enAU, // Fallback to AU for now
  'de-DE': deDE,
  'fr-FR': enAU, // Fallback to EN for now
  'es-ES': enAU  // Fallback to EN for now
};

// Get browser language
function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en-AU';
  
  const browserLang = navigator.language || 'en-AU';
  
  // Check if we have exact match
  if (translations[browserLang as keyof typeof translations]) {
    return browserLang;
  }
  
  // Check for language code only (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0];
  const matchingLang = Object.keys(translations).find(lang => 
    lang.startsWith(langCode)
  );
  
  return matchingLang || 'en-AU';
}

// Get nested translation value
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Main translation hook
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en-AU');
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [isClient, setIsClient] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('prepflow_language');
    const browserLanguage = getBrowserLanguage();
    
    setCurrentLanguage(savedLanguage || browserLanguage);
    setIsLoading(false);
  }, []);

  // Get translation function
  const t = (key: string, fallback?: string | any[]): string | any[] => {
    // Always try to get translation, even during SSR
    const currentTranslations = translations[currentLanguage as keyof typeof translations] || translations['en-AU'];
    const translation = getNestedValue(currentTranslations, key);
    
    // If translation is found, return it
    if (translation !== undefined) {
      return translation;
    }
    
    // If no translation found, return fallback or key
    return fallback || key;
  };

  // Change language
  const changeLanguage = (language: string) => {
    if (translations[language as keyof typeof translations]) {
      setCurrentLanguage(language);
      localStorage.setItem('prepflow_language', language);
      
      // Reload the page to apply the new language
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return availableLanguages[currentLanguage as keyof typeof availableLanguages] || availableLanguages['en-AU'];
  };

  // Get all available languages
  const getAvailableLanguages = () => {
    return Object.entries(availableLanguages).map(([code, info]) => ({
      code,
      ...info
    }));
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    getAvailableLanguages,
    isLoading
  };
}

// Utility function for components that need translation outside of hook
export function getTranslation(key: string, language: string = 'en-AU'): string {
  const currentTranslations = translations[language as keyof typeof translations] || translations['en-AU'];
  return getNestedValue(currentTranslations, key) || key;
}

'use client';

import { useState, useEffect } from 'react';

const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
const defaultLocale = 'en';

export function useLanguageDetection() {
  const [locale, setLocale] = useState<string>(defaultLocale);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    // Function to detect browser language
    const detectBrowserLanguage = (): string => {
      if (typeof window === 'undefined') return defaultLocale;

      // Get browser language
      const browserLang = navigator.language || (navigator as any).userLanguage;
      
      if (!browserLang) return defaultLocale;

      // Extract language code (e.g., 'en' from 'en-US')
      const langCode = browserLang.split('-')[0].toLowerCase();
      
      // Check if the language is supported
      if (supportedLocales.includes(langCode)) {
        return langCode;
      }

      // Check for similar languages (e.g., 'en-US' -> 'en')
      const similarLang = supportedLocales.find(locale => 
        locale.startsWith(langCode) || langCode.startsWith(locale)
      );
      
      if (similarLang) {
        return similarLang;
      }

      // Check for language families
      const languageFamilyMap: { [key: string]: string } = {
        'zh': 'zh', // Chinese
        'ja': 'ja', // Japanese
        'ko': 'ko', // Korean
        'es': 'es', // Spanish
        'fr': 'fr', // French
        'de': 'de', // German
        'it': 'it', // Italian
        'pt': 'pt', // Portuguese
        'en': 'en', // English
      };

      // Check if the detected language belongs to a supported family
      for (const [family, supported] of Object.entries(languageFamilyMap)) {
        if (browserLang.toLowerCase().includes(family)) {
          return supported;
        }
      }

      return defaultLocale;
    };

    // Function to get stored language preference
    const getStoredLanguage = (): string | null => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('prepflow_language');
    };

    // Function to set language preference
    const setStoredLanguage = (lang: string) => {
      if (typeof window === 'undefined') return;
      localStorage.setItem('prepflow_language', lang);
    };

    // Detect language
    const detectedLocale = detectBrowserLanguage();
    const storedLocale = getStoredLanguage();
    
    // Use stored preference if available and valid, otherwise use detected
    const finalLocale = storedLocale && supportedLocales.includes(storedLocale) 
      ? storedLocale 
      : detectedLocale;

    setLocale(finalLocale);
    setStoredLanguage(finalLocale);
    setIsDetecting(false);
  }, []);

  const changeLanguage = (newLocale: string) => {
    if (supportedLocales.includes(newLocale)) {
      setLocale(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prepflow_language', newLocale);
      }
    }
  };

  return {
    locale,
    isDetecting,
    changeLanguage,
    supportedLocales,
    defaultLocale
  };
}
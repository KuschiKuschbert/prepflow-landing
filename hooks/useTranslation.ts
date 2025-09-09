'use client';

import { useState, useEffect } from 'react';
import { translations, type Locale, type TranslationKeys } from '../lib/translations';
import { useLanguageDetection } from './useLanguageDetection';

export function useTranslation() {
  const { locale, changeLanguage } = useLanguageDetection();
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>(translations.en);

  useEffect(() => {
    if (locale && translations[locale as Locale]) {
      setCurrentTranslations(translations[locale as Locale]);
    } else {
      setCurrentTranslations(translations.en);
    }
  }, [locale]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return {
    t,
    locale,
    changeLanguage
  };
}
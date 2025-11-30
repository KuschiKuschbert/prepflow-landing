'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CountryConfig,
  getCountryConfig,
  detectCountryFromLocale,
  COUNTRY_CONFIGS,
} from '@/lib/country-config';
import { logger } from '@/lib/logger';

interface CountryContextType {
  selectedCountry: string;
  countryConfig: CountryConfig;
  setCountry: (countryCode: string) => void;
  isLoading: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: ReactNode;
}

export function CountryProvider({ children }: CountryProviderProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('AU');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved country preference or detect from IP/browser
  useEffect(() => {
    const loadCountryPreference = async () => {
      try {
        // Check localStorage for saved preference first
        const savedCountry = localStorage.getItem('prepflow-country');
        if (savedCountry && COUNTRY_CONFIGS[savedCountry]) {
          setSelectedCountry(savedCountry);
          setIsLoading(false);
          return;
        }

        // Try to detect country from IP address
        try {
          const response = await fetch('/api/detect-country');
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.country && COUNTRY_CONFIGS[data.country]) {
              setSelectedCountry(data.country);
              // Save auto-detected country to localStorage
              try {
                localStorage.setItem('prepflow-country', data.country);
              } catch (storageError) {
                logger.warn('[CountryContext] Failed to save auto-detected country:', storageError);
              }
              setIsLoading(false);
              return;
            }
          }
        } catch (ipError) {
          logger.warn('[CountryContext] IP detection failed, falling back to browser locale:', {
            error: ipError instanceof Error ? ipError.message : String(ipError),
          });
        }

        // Fallback to browser locale detection
        const browserLocale = navigator.language || 'en-AU';
        const detectedCountry = detectCountryFromLocale(browserLocale);
        setSelectedCountry(detectedCountry);
        // Save auto-detected country to localStorage
        try {
          localStorage.setItem('prepflow-country', detectedCountry);
        } catch (storageError) {
          logger.warn('[CountryContext] Failed to save auto-detected country:', storageError);
        }
      } catch (error) {
        logger.error('[CountryContext] Error loading country preference:', error);
        setSelectedCountry('AU'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadCountryPreference();
  }, []);

  const setCountry = (countryCode: string) => {
    if (COUNTRY_CONFIGS[countryCode]) {
      setSelectedCountry(countryCode);
      try {
        localStorage.setItem('prepflow-country', countryCode);
      } catch (error) {
        logger.error('[CountryContext] Error saving country preference:', error);
      }
    }
  };

  const countryConfig = getCountryConfig(selectedCountry);

  const value: CountryContextType = {
    selectedCountry,
    countryConfig,
    setCountry,
    isLoading,
  };

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

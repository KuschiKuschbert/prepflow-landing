'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CountryConfig,
  getCountryConfig,
  detectCountryFromLocale,
  COUNTRY_CONFIGS,
} from '@/lib/country-config';

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

  // Load saved country preference or detect from browser
  useEffect(() => {
    const loadCountryPreference = () => {
      try {
        // Check localStorage for saved preference
        const savedCountry = localStorage.getItem('prepflow-country');
        if (savedCountry && COUNTRY_CONFIGS[savedCountry]) {
          setSelectedCountry(savedCountry);
        } else {
          // Auto-detect from browser locale
          const browserLocale = navigator.language || 'en-AU';
          const detectedCountry = detectCountryFromLocale(browserLocale);
          setSelectedCountry(detectedCountry);
        }
      } catch (error) {
        console.error('Error loading country preference:', error);
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
        console.error('Error saving country preference:', error);
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

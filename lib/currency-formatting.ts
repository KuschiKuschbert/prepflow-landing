// Currency formatting utilities for internationalization performance
// This centralizes currency formatting to avoid repeated Intl.NumberFormat creation

import { CountryConfig } from './country-config';

interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  decimals: number;
}

// Supported currencies with their configurations
const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', decimals: 2 },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', locale: 'en-EU', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', decimals: 2 },
  NZD: { code: 'NZD', symbol: 'NZ$', locale: 'en-NZ', decimals: 2 },
};

// Cache for NumberFormat instances to avoid recreation
const formatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Get cached NumberFormat instance for currency formatting
 */
function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  const cacheKey = currency;

  if (!formatterCache.has(cacheKey)) {
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.AUD;
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    });
    formatterCache.set(cacheKey, formatter);
  }

  return formatterCache.get(cacheKey)!;
}

/**
 * Format currency amount with proper localization
 */
export function formatCurrency(
  amount: number,
  currency: string = 'AUD',
  options?: {
    showSymbol?: boolean;
    compact?: boolean;
  },
): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.AUD;
  const { showSymbol = true, compact = false } = options || {};

  if (compact && amount >= 1000) {
    // Use compact notation for large numbers
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  }

  const formatter = getCurrencyFormatter(currency);
  return formatter.format(amount);
}

/**
 * Format currency with country-specific configuration
 */
export function formatCurrencyWithCountry(
  amount: number,
  countryConfig: CountryConfig,
  options?: {
    includeTax?: boolean;
    compact?: boolean;
  },
): string {
  const { includeTax = false, compact = false } = options || {};
  const finalAmount = includeTax ? amount * (1 + countryConfig.taxRate) : amount;

  if (compact && finalAmount >= 1000) {
    return new Intl.NumberFormat(countryConfig.locale, {
      style: 'currency',
      currency: countryConfig.currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(finalAmount);
  }

  return new Intl.NumberFormat(countryConfig.locale, {
    style: 'currency',
    currency: countryConfig.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalAmount);
}

/**
 * Format currency for display in tables (without symbol)
 */
export function formatCurrencyValue(amount: number, currency: string = 'AUD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.AUD;
  const formatter = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  return formatter.format(amount);
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(value: string, currency: string = 'AUD'): number {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.AUD;

  // Remove currency symbols and spaces
  const cleanValue = value.replace(/[^\d.,-]/g, '').replace(',', '.');

  return parseFloat(cleanValue) || 0;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string = 'AUD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.AUD;
  return config.symbol;
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCY_CONFIGS);
}

/**
 * Format percentage with proper localization
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = 'en-AU',
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value / 100);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(
  value: number,
  locale: string = 'en-AU',
  decimals: number = 2,
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}

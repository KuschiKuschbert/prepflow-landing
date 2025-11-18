import { COUNTRY_CONFIGS, type CountryConfig } from './configs';

/**
 * Get country configuration for a given country code.
 *
 * @param {string} countryCode - ISO country code (e.g., 'AU', 'US')
 * @returns {CountryConfig} Country configuration (defaults to Australia if not found)
 */
export const getCountryConfig = (countryCode: string): CountryConfig =>
  COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS['AU'];

/**
 * Get all available country configurations.
 *
 * @returns {CountryConfig[]} Array of all country configurations
 */
export const getAvailableCountries = (): CountryConfig[] => Object.values(COUNTRY_CONFIGS);

/**
 * Detect country code from locale string.
 *
 * @param {string} locale - Locale string (e.g., 'en-AU', 'en-US')
 * @returns {string} Country code (defaults to 'AU' if not found)
 */
export const detectCountryFromLocale = (locale: string): string => {
  const localeToCountry: Record<string, string> = {
    'en-AU': 'AU',
    'en-US': 'US',
    'en-GB': 'GB',
    'en-CA': 'CA',
    'en-NZ': 'NZ',
    'de-DE': 'DE',
    'fr-FR': 'FR',
    'es-ES': 'ES',
    'it-IT': 'IT',
    'nl-NL': 'NL',
  };
  return localeToCountry[locale] || 'AU';
};

/**
 * Format currency amount with tax included.
 *
 * @param {number} amount - Base amount
 * @param {string} countryCode - ISO country code
 * @param {boolean} includeTax - Whether to include tax in the formatted amount (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrencyWithTax = (
  amount: number,
  countryCode: string,
  includeTax: boolean = true,
): string => {
  const config = getCountryConfig(countryCode);
  const taxAmount = amount * config.taxRate;
  const totalAmount = includeTax ? amount + taxAmount : amount;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(totalAmount);
};

/**
 * Get tax breakdown for an amount.
 *
 * @param {number} amount - Base amount
 * @param {string} countryCode - ISO country code
 * @returns {Object} Tax breakdown object
 */
export const getTaxBreakdown = (amount: number, countryCode: string) => {
  const config = getCountryConfig(countryCode);
  const taxAmount = amount * config.taxRate;
  const totalAmount = amount + taxAmount;
  return {
    subtotal: amount,
    taxRate: config.taxRate,
    taxAmount,
    total: totalAmount,
    taxName: config.taxName,
    currency: config.currency,
    locale: config.locale,
  };
};

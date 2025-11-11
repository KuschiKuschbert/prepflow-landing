export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  locale: string;
  taxRate: number;
  taxName: string;
  dateFormat: string;
  numberFormat: {
    decimalSeparator: string;
    thousandsSeparator: string;
  };
  phoneFormat?: string;
  addressFormat?: string[];
  unitSystem: 'metric' | 'imperial' | 'mixed'; // Metric (g/ml), Imperial (oz/lb), or Mixed (both)
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    locale: 'en-AU',
    taxRate: 0.1,
    taxName: 'GST',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    phoneFormat: '+61 X XXXX XXXX',
    addressFormat: ['Street Address', 'Suburb', 'State Postcode', 'Australia'],
    unitSystem: 'metric',
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    locale: 'en-US',
    taxRate: 0.08, // Average state sales tax
    taxName: 'Sales Tax',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    phoneFormat: '+1 (XXX) XXX-XXXX',
    addressFormat: ['Street Address', 'City, State ZIP', 'United States'],
    unitSystem: 'imperial',
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    locale: 'en-GB',
    taxRate: 0.2,
    taxName: 'VAT',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    phoneFormat: '+44 XXXX XXX XXX',
    addressFormat: ['Street Address', 'City', 'Postcode', 'United Kingdom'],
    unitSystem: 'mixed',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    locale: 'de-DE',
    taxRate: 0.19,
    taxName: 'MwSt',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    phoneFormat: '+49 XXX XXXXXXX',
    addressFormat: ['Street Address', 'Postcode City', 'Germany'],
    unitSystem: 'metric',
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    locale: 'fr-FR',
    taxRate: 0.2,
    taxName: 'TVA',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: ' ',
    },
    phoneFormat: '+33 X XX XX XX XX',
    addressFormat: ['Street Address', 'Postcode City', 'France'],
    unitSystem: 'metric',
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    currency: 'EUR',
    locale: 'es-ES',
    taxRate: 0.21,
    taxName: 'IVA',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    phoneFormat: '+34 XXX XXX XXX',
    addressFormat: ['Street Address', 'Postcode City', 'Spain'],
    unitSystem: 'metric',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    locale: 'en-CA',
    taxRate: 0.13, // Average HST/GST
    taxName: 'HST/GST',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    phoneFormat: '+1 (XXX) XXX-XXXX',
    addressFormat: ['Street Address', 'City, Province Postal Code', 'Canada'],
    unitSystem: 'mixed',
  },
  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    currency: 'NZD',
    locale: 'en-NZ',
    taxRate: 0.15,
    taxName: 'GST',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
    },
    phoneFormat: '+64 XX XXX XXXX',
    addressFormat: ['Street Address', 'Suburb', 'City Postcode', 'New Zealand'],
    unitSystem: 'metric',
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    currency: 'EUR',
    locale: 'it-IT',
    taxRate: 0.22,
    taxName: 'IVA',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    phoneFormat: '+39 XXX XXX XXXX',
    addressFormat: ['Street Address', 'Postcode City', 'Italy'],
    unitSystem: 'metric',
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    currency: 'EUR',
    locale: 'nl-NL',
    taxRate: 0.21,
    taxName: 'BTW',
    dateFormat: 'DD-MM-YYYY',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
    },
    phoneFormat: '+31 XX XXX XXXX',
    addressFormat: ['Street Address', 'Postcode City', 'Netherlands'],
    unitSystem: 'metric',
  },
};

export const getCountryConfig = (countryCode: string): CountryConfig => {
  return COUNTRY_CONFIGS[countryCode] || COUNTRY_CONFIGS['AU'];
};

export const getAvailableCountries = (): CountryConfig[] => {
  return Object.values(COUNTRY_CONFIGS);
};

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

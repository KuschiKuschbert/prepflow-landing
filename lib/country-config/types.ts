/**
 * Country configuration interface.
 */
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


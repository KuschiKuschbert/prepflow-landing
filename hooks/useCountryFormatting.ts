import { useCountry } from '@/contexts/CountryContext';
import { formatCurrencyWithTax, getTaxBreakdown } from '@/lib/country-config';

export function useCountryFormatting() {
  const { countryConfig } = useCountry();

  const formatCurrency = (amount: number, includeTax: boolean = true) => {
    return formatCurrencyWithTax(amount, countryConfig.code, includeTax);
  };

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(countryConfig.locale, options).format(date);
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(countryConfig.locale, options).format(num);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(countryConfig.locale, { 
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  const calculateTax = (amount: number) => {
    return getTaxBreakdown(amount, countryConfig.code);
  };

  const getTaxInfo = () => ({
    rate: countryConfig.taxRate,
    name: countryConfig.taxName,
    currency: countryConfig.currency
  });

  return {
    countryConfig,
    formatCurrency,
    formatDate,
    formatNumber,
    formatPercentage,
    calculateTax,
    getTaxInfo
  };
}

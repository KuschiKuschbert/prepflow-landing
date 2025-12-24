import { CountryConfig } from '@/lib/country-config';
import { formatCurrencyWithTax } from '@/lib/country-config';

export function formatPrice(
  amount: number,
  countryConfig: CountryConfig,
  includeTax: boolean = true,
) {
  return formatCurrencyWithTax(amount, countryConfig.code, includeTax);
}

export function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatNumber(num: number, locale: string) {
  return new Intl.NumberFormat(locale).format(num);
}

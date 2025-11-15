/**
 * Kitchen Context Builder
 *
 * Builds location-specific kitchen context for AI prompts using:
 * - User's current location (from IP detection)
 * - Fallback to location set during setup (localStorage)
 * - Fallback to browser locale
 *
 * Integrates with CountryContext and temperature standards
 */

import { getCountryConfig, CountryConfig } from '@/lib/country-config';
import { getTemperatureStandards, TemperatureStandards } from '@/lib/temperature-standards';

export interface KitchenContext {
  countryCode: string;
  countryName: string;
  currency: string;
  unitSystem: 'metric' | 'imperial' | 'mixed';
  taxName: string;
  taxRate: number;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  temperatureStandards: TemperatureStandards;
  regulations: string;
}

/**
 * Build kitchen context string for AI prompts
 * @param countryCode - Two-letter country code (AU, US, UK, etc.)
 * @returns Formatted context string for AI prompts
 */
export function buildKitchenContext(countryCode: string): string {
  const countryConfig = getCountryConfig(countryCode);
  const tempStandards = getTemperatureStandards(countryCode);

  // Determine time format (24h for most countries, 12h for US)
  const timeFormat = countryCode === 'US' ? '12h' : '24h';

  // Get regulations based on country
  const regulations = getRegulations(countryCode);

  const context = `
**Kitchen Location & Regional Settings:**
- Country: ${countryConfig.name} (${countryConfig.code})
- Currency: ${countryConfig.currency}
- Unit System: ${countryConfig.unitSystem === 'metric' ? 'Metric (grams, milliliters, kilograms, liters)' : countryConfig.unitSystem === 'imperial' ? 'Imperial (ounces, pounds, fluid ounces, gallons)' : 'Mixed (both metric and imperial)'}
- Tax: ${countryConfig.taxName} at ${(countryConfig.taxRate * 100).toFixed(1)}%
- Date Format: ${countryConfig.dateFormat}
- Time Format: ${timeFormat === '24h' ? '24-hour (e.g., 14:30)' : '12-hour (e.g., 2:30 PM)'}
- Number Format: ${countryConfig.numberFormat.decimalSeparator} for decimals, ${countryConfig.numberFormat.thousandsSeparator} for thousands

**Food Safety Standards (${regulations}):**
- Cold Storage: ${tempStandards.cold.min}°C to ${tempStandards.cold.max}°C (${tempStandards.cold.description})
- Hot Holding: ≥${tempStandards.hot.min}°C${tempStandards.hot.max ? ` to ${tempStandards.hot.max}°C` : ''} (${tempStandards.hot.description})
- Freezer: ${tempStandards.freezer.min}°C to ${tempStandards.freezer.max}°C (${tempStandards.freezer.description})
- Temperature Danger Zone: ${tempStandards.dangerZone.min}°C to ${tempStandards.dangerZone.max}°C (${tempStandards.dangerZone.description})

**Regional Regulations:**
${regulations}
`.trim();

  return context;
}

/**
 * Get regulations text based on country
 */
function getRegulations(countryCode: string): string {
  const regulationsMap: Record<string, string> = {
    AU: 'Queensland Health food safety regulations apply. Follow the 2-hour/4-hour rule for time in danger zone. All temperature monitoring must comply with Queensland Health standards.',
    US: 'FDA Food Code regulations apply. Follow HACCP principles and maintain proper temperature logs. All food safety practices must comply with FDA standards.',
    GB: 'Food Standards Agency (FSA) regulations apply. Follow HACCP principles and maintain proper documentation. All practices must comply with UK food safety standards.',
    EU: 'EU General Food Law and EFSA regulations apply. Follow HACCP principles and maintain proper documentation. All practices must comply with EU food safety standards.',
    CA: 'Canadian Food Inspection Agency (CFIA) regulations apply. Follow HACCP principles and maintain proper temperature logs. All practices must comply with CFIA standards.',
    NZ: 'New Zealand Food Safety Authority (NZFSA) regulations apply. Follow HACCP principles and maintain proper documentation. All practices must comply with NZ food safety standards.',
    DE: 'EU General Food Law and German food safety regulations apply. Follow HACCP principles and maintain proper documentation.',
    FR: 'EU General Food Law and French food safety regulations apply. Follow HACCP principles and maintain proper documentation.',
    ES: 'EU General Food Law and Spanish food safety regulations apply. Follow HACCP principles and maintain proper documentation.',
    IT: 'EU General Food Law and Italian food safety regulations apply. Follow HACCP principles and maintain proper documentation.',
    NL: 'EU General Food Law and Dutch food safety regulations apply. Follow HACCP principles and maintain proper documentation.',
  };

  return regulationsMap[countryCode] || regulationsMap.AU;
}

/**
 * Get kitchen context object (for programmatic use)
 */
export function getKitchenContext(countryCode: string): KitchenContext {
  const countryConfig = getCountryConfig(countryCode);
  const tempStandards = getTemperatureStandards(countryCode);
  const timeFormat = countryCode === 'US' ? '12h' : '24h';

  return {
    countryCode: countryConfig.code,
    countryName: countryConfig.name,
    currency: countryConfig.currency,
    unitSystem: countryConfig.unitSystem,
    taxName: countryConfig.taxName,
    taxRate: countryConfig.taxRate,
    dateFormat: countryConfig.dateFormat,
    timeFormat,
    temperatureStandards: tempStandards,
    regulations: getRegulations(countryCode),
  };
}

# Country & Tax Configuration System

## Overview

The PrepFlow country configuration system allows users to set their country of operations and automatically configures tax rates, currency formatting, and localization across the entire application.

## Features

- **10 Supported Countries**: Australia, US, UK, Germany, France, Spain, Canada, New Zealand, Italy, Netherlands
- **Automatic Tax Calculation**: GST, VAT, Sales Tax, etc. with country-specific rates
- **Currency Formatting**: Proper currency symbols and formatting for each country
- **Date & Number Formatting**: Localized date and number formats
- **Persistent Settings**: User preferences saved in localStorage
- **Browser Detection**: Auto-detects country from browser locale

## Usage

### 1. Setting Up Country Context

Wrap your app or specific components with the `CountryProvider`:

```tsx
import { CountryProvider } from '@/contexts/CountryContext';

function App() {
  return (
    <CountryProvider>
      <YourApp />
    </CountryProvider>
  );
}
```

### 2. Using Country Configuration

Use the `useCountry` hook to access country settings:

```tsx
import { useCountry } from '@/contexts/CountryContext';

function MyComponent() {
  const { selectedCountry, countryConfig, setCountry } = useCountry();

  return (
    <div>
      <p>Current Country: {countryConfig.name}</p>
      <p>Currency: {countryConfig.currency}</p>
      <p>
        Tax Rate: {countryConfig.taxName} {(countryConfig.taxRate * 100).toFixed(1)}%
      </p>
    </div>
  );
}
```

### 3. Country-Aware Formatting

Use the `useCountryFormatting` hook for localized formatting:

```tsx
import { useCountryFormatting } from '@/hooks/useCountryFormatting';

function PriceDisplay({ amount }: { amount: number }) {
  const { formatCurrency, formatDate, calculateTax } = useCountryFormatting();

  const taxBreakdown = calculateTax(amount);

  return (
    <div>
      <p>Subtotal: {formatCurrency(amount, false)}</p>
      <p>
        Tax ({taxBreakdown.taxName}): {formatCurrency(taxBreakdown.taxAmount, false)}
      </p>
      <p>Total: {formatCurrency(amount, true)}</p>
    </div>
  );
}
```

### 4. Direct Country Configuration Access

Access country configurations directly:

```tsx
import { getCountryConfig, formatCurrencyWithTax } from '@/lib/country-config';

const config = getCountryConfig('AU'); // Australia
const priceWithTax = formatCurrencyWithTax(100, 'AU', true); // Includes GST
```

## Country Configurations

| Country        | Code | Currency | Tax Rate | Tax Name  | Locale |
| -------------- | ---- | -------- | -------- | --------- | ------ |
| Australia      | AU   | AUD      | 10%      | GST       | en-AU  |
| United States  | US   | USD      | 8%       | Sales Tax | en-US  |
| United Kingdom | GB   | GBP      | 20%      | VAT       | en-GB  |
| Germany        | DE   | EUR      | 19%      | MwSt      | de-DE  |
| France         | FR   | EUR      | 20%      | TVA       | fr-FR  |
| Spain          | ES   | EUR      | 21%      | IVA       | es-ES  |
| Canada         | CA   | CAD      | 13%      | HST/GST   | en-CA  |
| New Zealand    | NZ   | NZD      | 15%      | GST       | en-NZ  |
| Italy          | IT   | EUR      | 22%      | IVA       | it-IT  |
| Netherlands    | NL   | EUR      | 21%      | BTW       | nl-NL  |

## Integration Points

### COGS Calculator

- Automatically includes tax in cost calculations
- Uses country-specific tax rates
- Formats currency according to country settings

### Recipe Management

- Ingredient costs formatted in local currency
- Recipe pricing includes tax calculations
- Export formats use local date/number formats

### Performance Analysis

- Revenue calculations include tax
- Profit margins calculated with country-specific tax rates
- Reports formatted for local standards

### Order Management

- Supplier pricing in local currency
- Order totals include tax
- Delivery addresses formatted for country

## Setup Process

1. **User selects country** in the setup page
2. **Settings saved** to localStorage
3. **Context updated** across the application
4. **All formatting** automatically adjusts
5. **Tax calculations** use country-specific rates

## Technical Implementation

### Files Created

- `lib/country-config.ts` - Country configurations and utilities
- `contexts/CountryContext.tsx` - React context for country state
- `components/CountrySetup.tsx` - Country selection UI
- `hooks/useCountryFormatting.ts` - Formatting utilities hook

### Key Functions

- `getCountryConfig(countryCode)` - Get country configuration
- `formatCurrencyWithTax(amount, country, includeTax)` - Format currency with tax
- `getTaxBreakdown(amount, country)` - Calculate tax breakdown
- `detectCountryFromLocale(locale)` - Auto-detect country from browser

## Future Enhancements

- **More Countries**: Add support for additional countries
- **Regional Tax Rates**: Support for state/province-specific tax rates
- **Multi-Currency**: Support for businesses operating in multiple currencies
- **Tax Exemptions**: Handle tax-exempt items and categories
- **Reporting**: Country-specific financial reporting formats

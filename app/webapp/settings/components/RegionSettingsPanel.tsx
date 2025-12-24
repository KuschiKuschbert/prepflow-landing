'use client';

import { Icon } from '@/components/ui/Icon';
import { useCountry } from '@/contexts/CountryContext';
import { getAvailableCountries } from '@/lib/country-config';
import { Check, Globe } from 'lucide-react';

/**
 * Region settings panel for Preferences section.
 * Allows users to change their region and unit system.
 *
 * @component
 */
export function RegionSettingsPanel() {
  const { selectedCountry, countryConfig, setCountry, isLoading } = useCountry();
  const availableCountries = getAvailableCountries();

  const getUnitSystemLabel = (unitSystem: string) => {
    switch (unitSystem) {
      case 'metric':
        return 'Metric';
      case 'imperial':
        return 'Imperial';
      case 'mixed':
        return 'Mixed';
      default:
        return unitSystem;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
          <Icon icon={Globe} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">Region & Units</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Currently: {selectedCountry} • {getUnitSystemLabel(countryConfig.unitSystem)}
          </p>
        </div>
      </div>

      {/* Country Selection Grid */}
      <div className="tablet:grid-cols-2 grid grid-cols-1 gap-2">
        {availableCountries.map(country => {
          const isSelected = selectedCountry === country.code;
          return (
            <button
              key={country.code}
              onClick={() => setCountry(country.code)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                isSelected
                  ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/10'
                  : 'border border-[var(--border)] hover:bg-[var(--muted)]/40 active:scale-[0.98]'
              }`}
              style={{ transitionTimingFunction: 'var(--easing-standard)' }}
            >
              <div className="min-w-0 flex-1">
                <div
                  className={`font-medium ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}
                >
                  {country.name}
                </div>
                <div className="text-xs text-[var(--foreground-subtle)]">
                  {getUnitSystemLabel(country.unitSystem)} • {country.currency}
                </div>
              </div>
              {isSelected && (
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

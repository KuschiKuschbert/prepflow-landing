'use client';

import { Icon } from '@/components/ui/Icon';
import { useCountry } from '@/contexts/CountryContext';
import { getAvailableCountries } from '@/lib/country-config';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Small, unobtrusive region selector component.
 * Shows current country code and unit system with a compact dropdown to change.
 *
 * @component
 * @returns {JSX.Element} Region selector badge/button
 */
export function RegionSelector() {
  const { selectedCountry, countryConfig, setCountry, isLoading } = useCountry();
  const availableCountries = getAvailableCountries();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleCountrySelect = (countryCode: string) => {
    setCountry(countryCode);
    setIsOpen(false);
  };

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
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 px-3 py-1.5">
        <div className="h-4 w-8 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 px-3 py-1.5 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40 hover:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
        aria-label="Change region"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon={Globe} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        <span className="font-medium">
          {selectedCountry} • {getUnitSystemLabel(countryConfig.unitSystem)}
        </span>
        <Icon
          icon={ChevronDown}
          size="xs"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden={true}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 z-50 mt-2 max-h-[400px] w-64 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          role="menu"
        >
          <div className="p-2">
            {availableCountries.map(country => {
              const isSelected = selectedCountry === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)]/40 hover:text-[var(--foreground)]'
                  }`}
                  role="menuitem"
                >
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {getUnitSystemLabel(country.unitSystem)} • {country.currency} •{' '}
                      {country.taxName}
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
      )}
    </div>
  );
}

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
      <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 px-3 py-1.5">
        <div className="h-4 w-8 animate-pulse rounded bg-[#2a2a2a]" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
        aria-label="Change region"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon={Globe} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
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
          className="absolute right-0 top-full z-50 mt-2 w-64 max-h-[400px] overflow-y-auto rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl"
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
                      ? 'bg-[#29E7CD]/10 text-[#29E7CD]'
                      : 'text-gray-300 hover:bg-[#2a2a2a]/40 hover:text-white'
                  }`}
                  role="menuitem"
                >
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-gray-400">
                      {getUnitSystemLabel(country.unitSystem)} • {country.currency} • {country.taxName}
                    </div>
                  </div>
                  {isSelected && (
                    <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
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

'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import {
  getAvailableCountries,
  getTaxBreakdown,
  formatCurrencyWithTax,
} from '@/lib/country-config';
import { Icon } from '@/components/ui/Icon';
import { Globe, MapPin, Settings, Calculator, BarChart3, Zap, Search, ChevronDown } from 'lucide-react';

export default function CountrySetup() {
  const { selectedCountry, countryConfig, setCountry } = useCountry();
  const [testAmount, setTestAmount] = useState(100);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableCountries = getAvailableCountries();
  const taxBreakdown = getTaxBreakdown(testAmount, selectedCountry);
  const filteredCountries = availableCountries.filter(
    country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < filteredCountries.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredCountries.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          setCountry(filteredCountries[highlightedIndex].code);
          setSearchTerm('');
          setShowDropdown(false);
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };
  const formatPrice = (amount: number, includeTax: boolean = true) =>
    formatCurrencyWithTax(amount, selectedCountry, includeTax);
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(countryConfig.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  const formatNumber = (num: number) => new Intl.NumberFormat(countryConfig.locale).format(num);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface)] p-6">
      <div className="mb-6 text-center">
        <h2 className="text-fluid-2xl mb-2 flex items-center justify-center gap-2 font-bold text-[var(--primary)]">
          <Icon icon={Globe} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
          Country & Tax Setup
        </h2>
        <p className="text-fluid-sm text-[var(--foreground-muted)]">
          Configure your country for automatic tax rates and currency formatting
        </p>
      </div>
      <div className="mb-6 rounded-xl bg-[var(--muted)]/50 p-4">
        <h3 className="text-fluid-lg mb-3 flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <Icon icon={MapPin} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          Select Your Country
        </h3>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search countries..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-[var(--primary)]/30 bg-[var(--surface)] p-3 pr-10 pl-10 text-[var(--foreground)] placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon icon={Search} size="md" className="text-[var(--foreground-muted)]" aria-hidden={true} />
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80"
              aria-label="Toggle country dropdown"
            >
              <Icon icon={ChevronDown} size="md" className="text-[var(--primary)]" aria-hidden={true} />
            </button>
          </div>
          {showDropdown && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[var(--primary)]/30 bg-[var(--surface)] shadow-lg">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setCountry(country.code);
                      setSearchTerm('');
                      setShowDropdown(false);
                      setHighlightedIndex(-1);
                    }}
                    className={`w-full p-3 text-left transition-colors ${
                      selectedCountry === country.code
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : highlightedIndex === index
                          ? 'bg-[var(--muted)]/70 text-[var(--foreground)]'
                          : 'text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{country.name}</div>
                        <div className="text-fluid-sm text-[var(--foreground-muted)]">
                          {country.currency} • {country.taxName}{' '}
                          {(country.taxRate * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-fluid-xs text-[var(--foreground-subtle)]">{country.code}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-[var(--foreground-muted)]">No countries found</div>
              )}
            </div>
          )}
        </div>

        <div className="text-fluid-sm mt-3 text-[var(--foreground-muted)]">
          Selected: <span className="font-medium text-[var(--primary)]">{countryConfig.name}</span> •
          Currency: <span className="text-[var(--foreground)]">{countryConfig.currency}</span> • Tax:{' '}
          <span className="text-[var(--foreground)]">
            {countryConfig.taxName} {(countryConfig.taxRate * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="mb-6 rounded-xl bg-[var(--muted)]/50 p-3">
        <h3 className="text-fluid-base mb-2 flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <Icon icon={Settings} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          Configuration Details
        </h3>
        <div className="text-fluid-xs flex flex-wrap gap-3">
          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Date:</span>
            <span className="text-[var(--foreground)]">{countryConfig.dateFormat}</span>
            <span className="text-[var(--foreground-muted)]">({formatDate(new Date())})</span>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Locale:</span>
            <span className="text-[var(--foreground)]">{countryConfig.locale}</span>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Time:</span>
            <span className="text-[var(--foreground)]">{countryConfig.dateFormat}</span>
          </div>
        </div>
      </div>
      <div className="mb-6 rounded-xl bg-[var(--muted)]/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-fluid-base flex items-center gap-2 font-semibold text-[var(--foreground)]">
            <Icon icon={Calculator} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
            Tax Calculator
          </h3>
          <button
            onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
            className="text-fluid-xs rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1 text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80"
          >
            {showTaxBreakdown ? 'Hide' : 'Show'} Breakdown
          </button>
        </div>

        <div className="mb-2 flex items-center space-x-3">
          <label className="text-fluid-xs font-medium text-[var(--foreground)]">Test Amount:</label>
          <input
            type="number"
            value={testAmount}
            onChange={e => setTestAmount(Number(e.target.value))}
            className="text-fluid-xs w-20 rounded-lg border border-[var(--primary)]/30 bg-[var(--surface)] p-2 text-[var(--foreground)]"
            placeholder="100"
          />
          <div className="text-fluid-xs font-mono text-[var(--foreground)]">
            Total: {formatPrice(testAmount, true)}
          </div>
        </div>

        {showTaxBreakdown && (
          <div className="rounded-lg bg-[var(--surface)] p-2">
            <div className="text-fluid-xs flex justify-between">
              <div className="text-center">
                <div className="mb-1 text-[var(--foreground-muted)]">Subtotal</div>
                <div className="font-mono text-[var(--foreground)]">
                  {formatPrice(taxBreakdown.subtotal, false)}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-[var(--foreground-muted)]">{taxBreakdown.taxName}</div>
                <div className="font-mono text-[var(--primary)]">
                  {formatPrice(taxBreakdown.taxAmount, false)}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-[var(--foreground-muted)]">Total</div>
                <div className="font-mono font-semibold text-[var(--primary)]">
                  {formatPrice(taxBreakdown.total, false)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-6 rounded-xl bg-[var(--muted)]/50 p-3">
        <h3 className="text-fluid-base mb-2 flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <Icon icon={BarChart3} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          Formatting Examples
        </h3>
        <div className="text-fluid-xs flex flex-wrap gap-3">
          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Currency:</span>
            <span className="text-[var(--foreground)]">{formatPrice(testAmount, false)}</span>
            <span className="text-[var(--foreground-muted)]">→</span>
            <span className="text-[var(--primary)]">{formatPrice(testAmount, true)}</span>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Number:</span>
            <span className="text-[var(--foreground)]">{formatNumber(1234567.89)}</span>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Date:</span>
            <span className="text-[var(--foreground)]">{formatDate(new Date())}</span>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-[var(--surface)] px-3 py-2">
            <span className="font-medium text-[var(--primary)]">Percent:</span>
            <span className="text-[var(--foreground)]">
              {new Intl.NumberFormat(countryConfig.locale, { style: 'percent' }).format(0.15)}
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 p-3">
        <div className="flex items-start space-x-2">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
            <Icon icon={Zap} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
          <div>
            <h4 className="text-fluid-base mb-1 font-semibold text-[var(--foreground)]">Global Impact</h4>
            <p className="text-fluid-xs mb-2 text-[var(--foreground-secondary)]">
              This setting automatically applies across your entire PrepFlow system:
            </p>
            <div className="text-fluid-xs flex flex-wrap gap-2 text-[var(--foreground-secondary)]">
              <span>
                • Pricing uses {countryConfig.taxName} at {(countryConfig.taxRate * 100).toFixed(0)}
                %
              </span>
              <span>• Currency displays in {countryConfig.currency}</span>
              <span>• Dates follow {countryConfig.name} standards</span>
              <span>• COGS includes proper tax handling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

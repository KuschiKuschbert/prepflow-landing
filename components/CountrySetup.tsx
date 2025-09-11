'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import { getAvailableCountries, getTaxBreakdown, formatCurrencyWithTax } from '@/lib/country-config';

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
  
  // Filter countries based on search term
  const filteredCountries = availableCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
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

  const formatPrice = (amount: number, includeTax: boolean = true) => {
    return formatCurrencyWithTax(amount, selectedCountry, includeTax);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(countryConfig.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(countryConfig.locale).format(num);
  };

  return (
    <div className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-2xl p-6 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#29E7CD] mb-2">
          🌍 Country & Tax Setup
        </h2>
        <p className="text-gray-400 text-sm">
          Configure your country for automatic tax rates and currency formatting
        </p>
      </div>

      {/* Country Selection */}
      <div className="bg-[#2a2a2a]/50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">📍 Select Your Country</h3>
        
        {/* Modern Combobox Picker */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search countries..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-lg p-3 pl-10 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Dropdown Results */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                    className={`w-full text-left p-3 transition-colors ${
                      selectedCountry === country.code 
                        ? 'bg-[#29E7CD]/10 text-[#29E7CD]' 
                        : highlightedIndex === index
                        ? 'bg-[#2a2a2a]/70 text-white'
                        : 'text-white hover:bg-[#2a2a2a]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{country.name}</div>
                        <div className="text-sm text-gray-400">{country.currency} • {country.taxName} {(country.taxRate * 100).toFixed(0)}%</div>
                      </div>
                      <div className="text-xs text-gray-500">{country.code}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-center">No countries found</div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-3 text-sm text-gray-400">
          Selected: <span className="text-[#29E7CD] font-medium">{countryConfig.name}</span> • 
          Currency: <span className="text-white">{countryConfig.currency}</span> • 
          Tax: <span className="text-white">{countryConfig.taxName} {(countryConfig.taxRate * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="bg-[#2a2a2a]/50 rounded-xl p-3 mb-6">
        <h3 className="text-base font-semibold text-white mb-2">⚙️ Configuration Details</h3>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Date:</span>
            <span className="text-white">{countryConfig.dateFormat}</span>
            <span className="text-gray-400">({formatDate(new Date())})</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Locale:</span>
            <span className="text-white">{countryConfig.locale}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Time:</span>
            <span className="text-white">{countryConfig.dateFormat}</span>
          </div>
        </div>
      </div>

      {/* Tax Calculator */}
      <div className="bg-[#2a2a2a]/50 rounded-xl p-3 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-white">🧮 Tax Calculator</h3>
          <button
            onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
            className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-3 py-1 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 text-xs"
          >
            {showTaxBreakdown ? 'Hide' : 'Show'} Breakdown
          </button>
        </div>
        
        <div className="flex items-center space-x-3 mb-2">
          <label className="text-white font-medium text-xs">Test Amount:</label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(Number(e.target.value))}
            className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-lg p-2 text-white text-xs w-20"
            placeholder="100"
          />
          <div className="text-white font-mono text-xs">
            Total: {formatPrice(testAmount, true)}
          </div>
        </div>

        {showTaxBreakdown && (
          <div className="bg-[#1f1f1f] rounded-lg p-2">
            <div className="flex justify-between text-xs">
              <div className="text-center">
                <div className="text-gray-400 mb-1">Subtotal</div>
                <div className="text-white font-mono">{formatPrice(taxBreakdown.subtotal, false)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 mb-1">{taxBreakdown.taxName}</div>
                <div className="text-[#29E7CD] font-mono">{formatPrice(taxBreakdown.taxAmount, false)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 mb-1">Total</div>
                <div className="text-[#29E7CD] font-mono font-semibold">{formatPrice(taxBreakdown.total, false)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formatting Examples */}
      <div className="bg-[#2a2a2a]/50 rounded-xl p-3 mb-6">
        <h3 className="text-base font-semibold text-white mb-2">📊 Formatting Examples</h3>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Currency:</span>
            <span className="text-white">{formatPrice(testAmount, false)}</span>
            <span className="text-gray-400">→</span>
            <span className="text-[#29E7CD]">{formatPrice(testAmount, true)}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Number:</span>
            <span className="text-white">{formatNumber(1234567.89)}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Date:</span>
            <span className="text-white">{formatDate(new Date())}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#1f1f1f] rounded-lg px-3 py-2">
            <span className="text-[#29E7CD] font-medium">Percent:</span>
            <span className="text-white">
              {new Intl.NumberFormat(countryConfig.locale, { style: 'percent' }).format(0.15)}
            </span>
          </div>
        </div>
      </div>

      {/* Impact Notice */}
      <div className="bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 rounded-xl p-3">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">⚡</span>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-1">Global Impact</h4>
            <p className="text-gray-300 text-xs mb-2">
              This setting automatically applies across your entire PrepFlow system:
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-300">
              <span>• Pricing uses {countryConfig.taxName} at {(countryConfig.taxRate * 100).toFixed(0)}%</span>
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

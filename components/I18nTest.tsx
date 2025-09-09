'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../lib/currency-formatting';

export default function I18nTest() {
  const [locale, setLocale] = useState('en-AU');
  const [currency, setCurrency] = useState('AUD');
  const [testAmount] = useState(29.50);

  // Detect browser language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || 'en-AU';
      setLocale(browserLang);
      
      // Set currency based on locale
      const currencyMap: Record<string, string> = {
        'en-AU': 'AUD',
        'en-US': 'USD',
        'en-GB': 'GBP',
        'de-DE': 'EUR',
        'fr-FR': 'EUR',
        'es-ES': 'EUR'
      };
      setCurrency(currencyMap[browserLang] || 'AUD');
    }
  }, []);

  const formatPrice = (amount: number, currencyCode: string, localeCode: string) => {
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  const formatDate = (date: Date, localeCode: string) => {
    return new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num: number, localeCode: string) => {
    return new Intl.NumberFormat(localeCode).format(num);
  };

  return (
    <div className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-3xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#29E7CD] mb-6 text-center">
        🌍 Internationalization Test
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white font-semibold mb-2">Browser Language:</label>
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#29E7CD]/30 rounded-lg p-3 text-white"
          >
            <option value="en-AU">English (Australia)</option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="de-DE">Deutsch (Germany)</option>
            <option value="fr-FR">Français (France)</option>
            <option value="es-ES">Español (Spain)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white font-semibold mb-2">Currency:</label>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#29E7CD]/30 rounded-lg p-3 text-white"
          >
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="USD">USD - US Dollar</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="EUR">EUR - Euro</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2a2a2a]/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Price Formatting</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">PrepFlow Price:</span>
              <span className="text-[#29E7CD] font-mono">
                {formatPrice(testAmount, currency, locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Using formatCurrency():</span>
              <span className="text-[#29E7CD] font-mono">
                {formatCurrency(testAmount, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#2a2a2a]/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Date Formatting</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Today:</span>
              <span className="text-[#29E7CD] font-mono">
                {formatDate(new Date(), locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Short:</span>
              <span className="text-[#29E7CD] font-mono">
                {new Intl.DateTimeFormat(locale).format(new Date())}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#2a2a2a]/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Number Formatting</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Large Number:</span>
              <span className="text-[#29E7CD] font-mono">
                {formatNumber(1234567.89, locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Percentage:</span>
              <span className="text-[#29E7CD] font-mono">
                {new Intl.NumberFormat(locale, { style: 'percent' }).format(0.15)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#2a2a2a]/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Browser Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Language:</span>
              <span className="text-[#29E7CD] font-mono">
                {typeof window !== 'undefined' ? navigator.language : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Languages:</span>
              <span className="text-[#29E7CD] font-mono text-xs">
                {typeof window !== 'undefined' ? navigator.languages?.slice(0, 2).join(', ') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Change your browser language settings and refresh to see automatic detection in action!
        </p>
      </div>
    </div>
  );
}

'use client';

import { getArcadeStats } from '@/lib/arcadeStats';
import React, { useEffect, useState } from 'react';
import { PersonalitySettingsPanel } from './components/PersonalitySettingsPanel';
import { useCountry } from '@/contexts/CountryContext';
import { getAvailableCountries } from '@/lib/country-config';

export default function SettingsPage() {
  const [busy, setBusy] = useState(false);
  const [arcadeStats, setArcadeStats] = useState(() => getArcadeStats());
  const { selectedCountry, countryConfig, setCountry } = useCountry();
  const availableCountries = getAvailableCountries();

  const request = async (path: string, method: 'GET' | 'POST') => {
    setBusy(true);
    try {
      const res = await fetch(path, { method });
      const data = await res.json();
      alert(data.message || (res.ok ? 'Done' : 'Error'));
    } finally {
      setBusy(false);
    }
  };

  // Update arcade stats when they change
  useEffect(() => {
    const handleStatsUpdate = () => {
      setArcadeStats(getArcadeStats());
    };

    window.addEventListener('arcade:statsUpdated', handleStatsUpdate);
    return () => window.removeEventListener('arcade:statsUpdated', handleStatsUpdate);
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Settings</h1>

      {/* Country/Region Selection */}
      <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <h2 className="text-xl font-semibold">Region & Units</h2>
        <p className="text-sm text-gray-300">
          Select your country to automatically configure units (metric/imperial) and regional
          settings.
        </p>
        <div>
          <label htmlFor="country-select" className="mb-2 block text-sm font-medium text-gray-300">
            Country
          </label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={e => setCountry(e.target.value)}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            {availableCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name} (
                {country.unitSystem === 'metric'
                  ? 'Metric (g/ml)'
                  : country.unitSystem === 'imperial'
                    ? 'Imperial (oz/lb)'
                    : 'Mixed'}
                )
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-400">
            Current unit system: <span className="font-medium">{countryConfig.unitSystem}</span> •
            Currency: {countryConfig.currency} • Tax: {countryConfig.taxName}{' '}
            {(countryConfig.taxRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
        <h2 className="text-xl font-semibold">Privacy controls</h2>
        <p className="text-gray-300">
          You can export or request deletion of your data at any time.
        </p>
        <div className="flex gap-3">
          <button
            disabled={busy}
            className="rounded-2xl border border-[#2a2a2a] px-4 py-2 hover:bg-[#2a2a2a]/40"
            onClick={() => request('/api/account/export', 'GET')}
          >
            Export my data
          </button>
          <button
            disabled={busy}
            className="rounded-2xl border border-[#2a2a2a] px-4 py-2 hover:bg-[#2a2a2a]/40"
            onClick={() => request('/api/account/delete', 'POST')}
          >
            Request deletion
          </button>
        </div>
      </div>

      {/* Arcade Stats - Fun Feature */}
      <div className="mt-8 rounded-2xl border border-[#2a2a2a]/30 bg-[#1f1f1f]/30 p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-400">Arcade Stats</h2>
        <p className="mb-4 text-sm text-gray-500">
          Your all-time stats across all sessions. Just for fun! 🎮
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/20 p-4">
            <div className="mb-1 text-2xl">🍅</div>
            <div className="mb-1 text-xs text-gray-500">Tomatoes Thrown</div>
            <div className="text-xl font-bold text-[#29E7CD]">{arcadeStats.tomatoes}</div>
          </div>
          <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/20 p-4">
            <div className="mb-1 text-2xl">📋</div>
            <div className="mb-1 text-xs text-gray-500">Dockets Caught</div>
            <div className="text-xl font-bold text-[#3B82F6]">{arcadeStats.dockets}</div>
          </div>
          <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/20 p-4">
            <div className="mb-1 text-2xl">🔥</div>
            <div className="mb-1 text-xs text-gray-500">Fires Extinguished</div>
            <div className="text-xl font-bold text-[#E74C3C]">{arcadeStats.fires}</div>
          </div>
        </div>
      </div>

      {/* PrepFlow Personality Settings */}
      <PersonalitySettingsPanel />
    </div>
  );
}

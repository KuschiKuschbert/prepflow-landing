'use client';

import { useState, useEffect } from 'react';

export function TemperatureConverter() {
  const [celsius, setCelsius] = useState<string>('');
  const [fahrenheit, setFahrenheit] = useState<string>('');

  const presets = [
    { label: 'Freezing', celsius: 0 },
    { label: 'Refrigerator', celsius: 4 },
    { label: 'Room Temp', celsius: 20 },
    { label: 'Body Temp', celsius: 37 },
    { label: 'Baking (Low)', celsius: 150 },
    { label: 'Baking (Medium)', celsius: 180 },
    { label: 'Baking (High)', celsius: 200 },
    { label: 'Roasting', celsius: 220 },
  ];

  const celsiusToFahrenheit = (c: number): number => (c * 9) / 5 + 32;
  const fahrenheitToCelsius = (f: number): number => ((f - 32) * 5) / 9;

  useEffect(() => {
    if (celsius !== '') {
      const c = parseFloat(celsius);
      if (!isNaN(c)) {
        setFahrenheit(celsiusToFahrenheit(c).toFixed(1));
      }
    } else if (fahrenheit === '') {
      setFahrenheit('');
    }
  }, [celsius]);

  useEffect(() => {
    if (fahrenheit !== '') {
      const f = parseFloat(fahrenheit);
      if (!isNaN(f)) {
        setCelsius(fahrenheitToCelsius(f).toFixed(1));
      }
    } else if (celsius === '') {
      setCelsius('');
    }
  }, [fahrenheit]);

  const handlePreset = (tempC: number) => {
    setCelsius(tempC.toString());
    setFahrenheit(celsiusToFahrenheit(tempC).toFixed(1));
  };

  return (
    <div className="w-full space-y-2 sm:space-y-4">
      <div className="hidden sm:block">
        <h2 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
          Temperature Converter
        </h2>
        <p className="text-xs text-gray-400">Convert between Celsius and Fahrenheit</p>
      </div>

      {/* Converter Interface */}
      <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Celsius (°C)</label>
          <input
            type="number"
            value={celsius}
            onChange={e => setCelsius(e.target.value)}
            placeholder="Enter temperature"
            step="0.1"
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
          />
          {celsius && !isNaN(parseFloat(celsius)) && (
            <div className="text-2xl font-bold text-[#29E7CD]">
              {parseFloat(celsius).toFixed(1)}°C
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Fahrenheit (°F)</label>
          <input
            type="number"
            value={fahrenheit}
            onChange={e => setFahrenheit(e.target.value)}
            placeholder="Enter temperature"
            step="0.1"
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {fahrenheit && !isNaN(parseFloat(fahrenheit)) && (
            <div className="text-2xl font-bold text-[#D925C7]">
              {parseFloat(fahrenheit).toFixed(1)}°F
            </div>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="w-full">
        <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
          Common Temperatures
        </label>
        <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2 md:grid-cols-4">
          {presets.map(preset => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.celsius)}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-1.5 text-left text-xs transition-colors hover:bg-[#2a2a2a] sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
            >
              <div className="font-medium text-white">{preset.label}</div>
              <div className="text-xs text-gray-400">
                {preset.celsius}°C / {celsiusToFahrenheit(preset.celsius).toFixed(0)}°F
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

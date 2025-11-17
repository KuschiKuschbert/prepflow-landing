'use client';

import { useEffect, useState } from 'react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fahrenheit]);

  const handlePreset = (tempC: number) => {
    setCelsius(tempC.toString());
    setFahrenheit(celsiusToFahrenheit(tempC).toFixed(1));
  };

  return (
    <div className="tablet:space-y-2 tablet:px-4 tablet:py-4 flex min-h-[600px] w-full flex-col justify-center space-y-1.5 overflow-y-auto px-3 py-3">
      <div className="tablet:block hidden">
        <h2 className="tablet:mb-2 tablet:text-lg mb-1 text-base font-semibold text-white">
          Temperature Converter
        </h2>
        <p className="text-xs text-gray-400">Convert between Celsius and Fahrenheit</p>
      </div>

      {/* Converter Interface */}
      <div className="tablet:grid-cols-2 tablet:gap-4 grid w-full gap-2">
        <div className="tablet:space-y-2 space-y-1">
          <label className="tablet:text-sm block text-xs font-medium text-gray-300">
            Celsius (°C)
          </label>
          <input
            type="number"
            value={celsius}
            onChange={e => setCelsius(e.target.value)}
            placeholder="Enter temperature"
            step="0.1"
            className="tablet:rounded-xl tablet:px-3 tablet:py-2.5 w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {celsius && !isNaN(parseFloat(celsius)) && (
            <div className="tablet:text-2xl text-lg font-bold text-[#29E7CD]">
              {parseFloat(celsius).toFixed(1)}°C
            </div>
          )}
        </div>

        <div className="tablet:space-y-2 space-y-1">
          <label className="tablet:text-sm block text-xs font-medium text-gray-300">
            Fahrenheit (°F)
          </label>
          <input
            type="number"
            value={fahrenheit}
            onChange={e => setFahrenheit(e.target.value)}
            placeholder="Enter temperature"
            step="0.1"
            className="tablet:rounded-xl tablet:px-3 tablet:py-2.5 w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {fahrenheit && !isNaN(parseFloat(fahrenheit)) && (
            <div className="tablet:text-2xl text-lg font-bold text-[#D925C7]">
              {parseFloat(fahrenheit).toFixed(1)}°F
            </div>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="w-full">
        <label className="tablet:mb-2 tablet:text-sm mb-1 block text-xs font-medium text-gray-300">
          Common Temperatures
        </label>
        <div className="tablet:grid-cols-3 tablet:gap-2 desktop:grid-cols-4 grid w-full grid-cols-2 gap-1">
          {presets.map(preset => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.celsius)}
              className="tablet:rounded-xl tablet:px-3 tablet:py-2 tablet:text-sm rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-1.5 text-left text-xs transition-colors hover:bg-[#2a2a2a]"
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

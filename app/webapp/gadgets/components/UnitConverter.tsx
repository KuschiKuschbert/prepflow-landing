'use client';

import { convertUnit, getAllUnits, isVolumeUnit, isWeightUnit } from '@/lib/unit-conversion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UnitConverter() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('g');
  const [toUnit, setToUnit] = useState<string>('kg');
  const [convertedValue, setConvertedValue] = useState<number | null>(null);

  // Check for recipe data from URL params (optional, for future enhancement)
  useEffect(() => {
    if (searchParams) {
      const recipeValue = searchParams.get('value');
      const recipeUnit = searchParams.get('unit');
      if (recipeValue && recipeUnit) {
        setValue(recipeValue);
        setFromUnit(recipeUnit);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (value && fromUnit && toUnit) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        const result = convertUnit(numValue, fromUnit, toUnit);
        setConvertedValue(result.value);
      } else {
        setConvertedValue(null);
      }
    } else {
      setConvertedValue(null);
    }
  }, [value, fromUnit, toUnit]);

  const weightUnits = getAllUnits().filter(u => isWeightUnit(u));
  const volumeUnits = getAllUnits().filter(u => isVolumeUnit(u));
  const allUnits = getAllUnits();

  const handleSwap = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    if (convertedValue !== null) {
      setValue(convertedValue.toFixed(2));
    }
  };

  return (
    <div className="flex min-h-[600px] w-full flex-col space-y-1.5 overflow-y-auto px-3 py-3 sm:space-y-2 sm:px-4 sm:py-4">
      <div className="hidden sm:block">
        <h2 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
          Unit Converter
        </h2>
        <p className="text-xs text-gray-400">Convert between weight and volume units</p>
      </div>

      {/* Recipe Integration Link - Hidden on mobile */}
      <div className="hidden w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-2 sm:block sm:p-4">
        <p className="text-xs text-gray-300 sm:text-sm">
          Need to convert recipe ingredients?{' '}
          <Link href="/webapp/recipes" className="text-[#29E7CD] hover:underline">
            Go to Recipes
          </Link>
        </p>
      </div>

      {/* Converter Interface */}
      <div className="w-full space-y-2 sm:space-y-4">
        <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-4">
          {/* From */}
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs font-medium text-gray-300 sm:text-sm">From</label>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Value"
              step="any"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
            />
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
            >
              {allUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs font-medium text-gray-300 sm:text-sm">To</label>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white sm:rounded-xl sm:px-3 sm:py-2.5">
              {convertedValue !== null ? convertedValue.toFixed(4) : '—'}
            </div>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
            >
              {allUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a] sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
        >
          ↕ Swap Units
        </button>

        {/* Unit Categories - Hidden on mobile */}
        <div className="hidden grid-cols-2 gap-4 sm:grid">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-300">Weight Units</h3>
            <div className="flex flex-wrap gap-2">
              {weightUnits.map(unit => (
                <span
                  key={unit}
                  className="rounded-lg bg-[#2a2a2a] px-2 py-1 text-xs text-gray-400"
                >
                  {unit}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-300">Volume Units</h3>
            <div className="flex flex-wrap gap-2">
              {volumeUnits.map(unit => (
                <span
                  key={unit}
                  className="rounded-lg bg-[#2a2a2a] px-2 py-1 text-xs text-gray-400"
                >
                  {unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

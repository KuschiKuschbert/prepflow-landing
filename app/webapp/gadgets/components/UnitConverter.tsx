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
    <div className="tablet:space-y-2 tablet:px-4 tablet:py-4 flex min-h-[600px] w-full flex-col space-y-1.5 overflow-y-auto px-3 py-3">
      <div className="tablet:block hidden">
        <h2 className="tablet:mb-2 tablet:text-lg mb-1 text-base font-semibold text-white">
          Unit Converter
        </h2>
        <p className="text-xs text-gray-400">Convert between weight and volume units</p>
      </div>

      {/* Recipe Integration Link - Hidden on mobile */}
      <div className="tablet:block tablet:p-4 hidden w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-2">
        <p className="tablet:text-sm text-xs text-gray-300">
          Need to convert recipe ingredients?{' '}
          <Link href="/webapp/recipes" className="text-[#29E7CD] hover:underline">
            Go to Recipes
          </Link>
        </p>
      </div>

      {/* Converter Interface */}
      <div className="tablet:space-y-4 w-full space-y-2">
        <div className="tablet:grid-cols-2 tablet:gap-4 grid w-full gap-2">
          {/* From */}
          <div className="tablet:space-y-2 space-y-1">
            <label className="tablet:text-sm block text-xs font-medium text-gray-300">From</label>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Value"
              step="any"
              className="tablet:rounded-xl tablet:px-3 tablet:py-2.5 w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            />
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="tablet:rounded-xl tablet:px-3 tablet:py-2.5 w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            >
              {allUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div className="tablet:space-y-2 space-y-1">
            <label className="tablet:text-sm block text-xs font-medium text-gray-300">To</label>
            <div className="tablet:rounded-xl tablet:px-3 tablet:py-2.5 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white">
              {convertedValue !== null ? convertedValue.toFixed(4) : '—'}
            </div>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="tablet:rounded-xl tablet:px-3 tablet:py-2.5 w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
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
          className="tablet:rounded-xl tablet:px-4 tablet:py-2 tablet:text-sm w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a]"
        >
          ↕ Swap Units
        </button>

        {/* Unit Categories - Hidden on mobile */}
        <div className="tablet:grid hidden grid-cols-2 gap-4">
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

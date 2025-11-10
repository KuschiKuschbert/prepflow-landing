'use client';

import { useState } from 'react';

export function YieldPortionCalculator() {
  const [totalYield, setTotalYield] = useState<string>('');
  const [portionSize, setPortionSize] = useState<string>('');
  const [numberOfPortions, setNumberOfPortions] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<'yield-to-portions' | 'portions-to-yield'>(
    'yield-to-portions',
  );

  const calculatePortions = () => {
    const yieldNum = parseFloat(totalYield);
    const portionNum = parseFloat(portionSize);
    if (!isNaN(yieldNum) && !isNaN(portionNum) && portionNum > 0) {
      const portions = yieldNum / portionNum;
      setNumberOfPortions(portions.toFixed(1));
    } else {
      setNumberOfPortions('');
    }
  };

  const calculateYield = () => {
    const portionsNum = parseFloat(numberOfPortions);
    const portionNum = parseFloat(portionSize);
    if (!isNaN(portionsNum) && !isNaN(portionNum) && portionNum > 0) {
      const calculatedYield = portionsNum * portionNum;
      setTotalYield(calculatedYield.toFixed(1));
    } else {
      setTotalYield('');
    }
  };

  const handlePreset = (size: number) => {
    setPortionSize(size.toString());
    if (calculationMode === 'yield-to-portions' && totalYield) {
      calculatePortions();
    }
  };

  const presets = [100, 150, 200, 250, 300];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">Yield/Portion Calculator</h2>
        <p className="text-sm text-gray-400">Calculate portions from yield or vice versa</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-1">
        <button
          onClick={() => {
            setCalculationMode('yield-to-portions');
            setNumberOfPortions('');
          }}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            calculationMode === 'yield-to-portions'
              ? 'bg-[#29E7CD] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Yield → Portions
        </button>
        <button
          onClick={() => {
            setCalculationMode('portions-to-yield');
            setTotalYield('');
          }}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            calculationMode === 'portions-to-yield'
              ? 'bg-[#29E7CD] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Portions → Yield
        </button>
      </div>

      <div className="space-y-4">
        {calculationMode === 'yield-to-portions' ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Total Recipe Yield (g or ml)
              </label>
              <input
                type="number"
                value={totalYield}
                onChange={e => {
                  setTotalYield(e.target.value);
                  if (portionSize) {
                    const yieldNum = parseFloat(e.target.value);
                    const portionNum = parseFloat(portionSize);
                    if (!isNaN(yieldNum) && !isNaN(portionNum) && portionNum > 0) {
                      setNumberOfPortions((yieldNum / portionNum).toFixed(1));
                    } else {
                      setNumberOfPortions('');
                    }
                  }
                }}
                placeholder="Enter total yield"
                min="0"
                step="0.1"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Portion Size (g or ml per serving)
              </label>
              <input
                type="number"
                value={portionSize}
                onChange={e => {
                  setPortionSize(e.target.value);
                  if (totalYield) {
                    const yieldNum = parseFloat(totalYield);
                    const portionNum = parseFloat(e.target.value);
                    if (!isNaN(yieldNum) && !isNaN(portionNum) && portionNum > 0) {
                      setNumberOfPortions((yieldNum / portionNum).toFixed(1));
                    } else {
                      setNumberOfPortions('');
                    }
                  }
                }}
                placeholder="Enter portion size"
                min="0"
                step="0.1"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {presets.map(size => (
                  <button
                    key={size}
                    onClick={() => handlePreset(size)}
                    className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-[#2a2a2a]"
                  >
                    {size}g
                  </button>
                ))}
              </div>
            </div>
            {numberOfPortions && (
              <div className="rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-6 text-center">
                <div className="text-sm text-gray-400">Number of Portions</div>
                <div className="mt-2 text-4xl font-bold text-[#29E7CD]">
                  {parseFloat(numberOfPortions).toFixed(1)}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Number of Portions
              </label>
              <input
                type="number"
                value={numberOfPortions}
                onChange={e => {
                  setNumberOfPortions(e.target.value);
                  if (portionSize) {
                    const portionsNum = parseFloat(e.target.value);
                    const portionNum = parseFloat(portionSize);
                    if (!isNaN(portionsNum) && !isNaN(portionNum) && portionNum > 0) {
                      setTotalYield((portionsNum * portionNum).toFixed(1));
                    } else {
                      setTotalYield('');
                    }
                  }
                }}
                placeholder="Enter number of portions"
                min="0"
                step="0.1"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Portion Size (g or ml per serving)
              </label>
              <input
                type="number"
                value={portionSize}
                onChange={e => {
                  setPortionSize(e.target.value);
                  if (numberOfPortions) {
                    const portionsNum = parseFloat(numberOfPortions);
                    const portionNum = parseFloat(e.target.value);
                    if (!isNaN(portionsNum) && !isNaN(portionNum) && portionNum > 0) {
                      setTotalYield((portionsNum * portionNum).toFixed(1));
                    } else {
                      setTotalYield('');
                    }
                  }
                }}
                placeholder="Enter portion size"
                min="0"
                step="0.1"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {presets.map(size => (
                  <button
                    key={size}
                    onClick={() => handlePreset(size)}
                    className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-[#2a2a2a]"
                  >
                    {size}g
                  </button>
                ))}
              </div>
            </div>
            {totalYield && (
              <div className="rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-6 text-center">
                <div className="text-sm text-gray-400">Total Recipe Yield</div>
                <div className="mt-2 text-4xl font-bold text-[#29E7CD]">
                  {parseFloat(totalYield).toFixed(1)}g
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

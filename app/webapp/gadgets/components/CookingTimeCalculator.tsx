'use client';

import { useState } from 'react';

type FoodType = 'meat' | 'vegetables' | 'pasta' | 'rice' | 'poultry' | 'fish' | 'bread';
type CookingMethod = 'roast' | 'boil' | 'steam' | 'grill' | 'fry' | 'bake';

interface CookingTimeData {
  [key: string]: {
    [method: string]: {
      baseTime: number; // minutes per 500g
      temperature?: number; // optional temperature in Celsius
    };
  };
}

const cookingTimes: CookingTimeData = {
  meat: {
    roast: { baseTime: 20, temperature: 180 },
    grill: { baseTime: 15 },
    fry: { baseTime: 12 },
  },
  poultry: {
    roast: { baseTime: 25, temperature: 180 },
    grill: { baseTime: 18 },
    fry: { baseTime: 15 },
  },
  fish: {
    roast: { baseTime: 12, temperature: 200 },
    grill: { baseTime: 10 },
    steam: { baseTime: 8 },
  },
  vegetables: {
    boil: { baseTime: 8 },
    steam: { baseTime: 6 },
    roast: { baseTime: 15, temperature: 200 },
  },
  pasta: {
    boil: { baseTime: 10 },
  },
  rice: {
    boil: { baseTime: 15 },
    steam: { baseTime: 20 },
  },
  bread: {
    bake: { baseTime: 30, temperature: 200 },
  },
};

export function CookingTimeCalculator() {
  const [foodType, setFoodType] = useState<FoodType>('meat');
  const [method, setMethod] = useState<CookingMethod>('roast');
  const [weight, setWeight] = useState<string>('500');
  const [temperature, setTemperature] = useState<string>('');
  const [calculatedTime, setCalculatedTime] = useState<number | null>(null);

  const calculateTime = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setCalculatedTime(null);
      return;
    }

    const foodData = cookingTimes[foodType];
    if (!foodData || !foodData[method]) {
      setCalculatedTime(null);
      return;
    }

    const methodData = foodData[method];
    const baseTime = methodData.baseTime;
    const timePer500g = baseTime;
    const calculated = (weightNum / 500) * timePer500g;

    setCalculatedTime(Math.round(calculated));
    if (methodData.temperature) {
      setTemperature(methodData.temperature.toString());
    }
  };

  const availableMethods =
    foodType && cookingTimes[foodType] ? Object.keys(cookingTimes[foodType]) : [];

  return (
    <div className="flex h-full w-full flex-col space-y-1.5 overflow-y-auto sm:space-y-2">
      <div className="hidden sm:block">
        <h2 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
          Cooking Time Calculator
        </h2>
        <p className="text-xs text-gray-400">Estimate cooking time based on food type and method</p>
      </div>

      <div className="w-full space-y-2 sm:space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
            Food Type
          </label>
          <select
            value={foodType}
            onChange={e => {
              setFoodType(e.target.value as FoodType);
              const newMethods = Object.keys(cookingTimes[e.target.value as FoodType] || {});
              if (newMethods.length > 0) {
                setMethod(newMethods[0] as CookingMethod);
              }
            }}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
          >
            <option value="meat">Meat</option>
            <option value="poultry">Poultry</option>
            <option value="fish">Fish</option>
            <option value="vegetables">Vegetables</option>
            <option value="pasta">Pasta</option>
            <option value="rice">Rice</option>
            <option value="bread">Bread</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
            Cooking Method
          </label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as CookingMethod)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
          >
            {availableMethods.map(m => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
            Weight (grams)
          </label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="500"
            min="1"
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5"
          />
        </div>

        {temperature && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
              Recommended Temperature (°C)
            </label>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white sm:rounded-xl sm:px-4 sm:py-3">
              {temperature}°C
            </div>
          </div>
        )}

        <button
          onClick={calculateTime}
          className="w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/20 sm:rounded-2xl sm:px-6 sm:py-3"
        >
          Calculate Cooking Time
        </button>

        {calculatedTime !== null && (
          <div className="rounded-xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-3 text-center sm:rounded-2xl sm:p-6">
            <div className="text-xs text-gray-400 sm:text-sm">Estimated Cooking Time</div>
            <div className="mt-1 text-2xl font-bold text-[#29E7CD] sm:mt-2 sm:text-4xl">
              {calculatedTime} minutes
            </div>
            <div className="mt-1 text-xs text-gray-400 sm:mt-2 sm:text-sm">
              ({Math.floor(calculatedTime / 60)}h {calculatedTime % 60}m)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

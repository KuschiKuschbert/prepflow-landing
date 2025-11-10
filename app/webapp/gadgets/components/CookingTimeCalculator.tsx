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
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">Cooking Time Calculator</h2>
        <p className="text-sm text-gray-400">Estimate cooking time based on food type and method</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Food Type</label>
          <select
            value={foodType}
            onChange={e => {
              setFoodType(e.target.value as FoodType);
              const newMethods = Object.keys(cookingTimes[e.target.value as FoodType] || {});
              if (newMethods.length > 0) {
                setMethod(newMethods[0] as CookingMethod);
              }
            }}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
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
          <label className="mb-2 block text-sm font-medium text-gray-300">Cooking Method</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as CookingMethod)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          >
            {availableMethods.map(m => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Weight (grams)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="500"
            min="1"
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
        </div>

        {temperature && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Recommended Temperature (°C)
            </label>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white">
              {temperature}°C
            </div>
          </div>
        )}

        <button
          onClick={calculateTime}
          className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/20"
        >
          Calculate Cooking Time
        </button>

        {calculatedTime !== null && (
          <div className="rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-6 text-center">
            <div className="text-sm text-gray-400">Estimated Cooking Time</div>
            <div className="mt-2 text-4xl font-bold text-[#29E7CD]">{calculatedTime} minutes</div>
            <div className="mt-2 text-sm text-gray-400">
              ({Math.floor(calculatedTime / 60)}h {calculatedTime % 60}m)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

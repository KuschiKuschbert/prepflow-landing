'use client';

import { useState, useEffect } from 'react';

interface IngredientDensity {
  name: string;
  density: number; // grams per cup
  packed?: boolean; // for ingredients like brown sugar
  notes?: string;
}

const ingredientDensities: IngredientDensity[] = [
  { name: 'All-purpose flour', density: 120, notes: 'Sifted' },
  { name: 'Bread flour', density: 136 },
  { name: 'Cake flour', density: 115 },
  { name: 'Whole wheat flour', density: 130 },
  { name: 'White sugar (granulated)', density: 200 },
  { name: 'Brown sugar', density: 220, packed: true },
  { name: 'Powdered sugar', density: 120 },
  { name: 'Butter', density: 227 },
  { name: 'Milk', density: 240 },
  { name: 'Heavy cream', density: 240 },
  { name: 'Water', density: 240 },
  { name: 'Honey', density: 340 },
  { name: 'Maple syrup', density: 320 },
  { name: 'Olive oil', density: 216 },
  { name: 'Vegetable oil', density: 218 },
  { name: 'Cocoa powder', density: 85 },
  { name: 'Cornstarch', density: 128 },
  { name: 'Rice (uncooked)', density: 200 },
  { name: 'Oats (rolled)', density: 100 },
  { name: 'Almonds (chopped)', density: 95 },
];

export function VolumeToWeightConverter() {
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDensity | null>(null);
  const [volume, setVolume] = useState<string>('');
  const [volumeUnit, setVolumeUnit] = useState<'cup' | 'tbsp' | 'tsp' | 'ml'>('cup');
  const [weight, setWeight] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = ingredientDensities.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (selectedIngredient && volume) {
      const volumeNum = parseFloat(volume);
      if (!isNaN(volumeNum) && volumeNum > 0) {
        let cups = volumeNum;
        if (volumeUnit === 'tbsp') cups = volumeNum / 16;
        if (volumeUnit === 'tsp') cups = volumeNum / 48;
        if (volumeUnit === 'ml') cups = volumeNum / 240;

        const grams = cups * selectedIngredient.density;
        setWeight(grams);
      } else {
        setWeight(null);
      }
    } else {
      setWeight(null);
    }
  }, [selectedIngredient, volume, volumeUnit]);

  const volumeUnits = [
    { value: 'cup', label: 'Cup', ml: 240 },
    { value: 'tbsp', label: 'Tablespoon', ml: 15 },
    { value: 'tsp', label: 'Teaspoon', ml: 5 },
    { value: 'ml', label: 'Milliliter', ml: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">Volume to Weight Converter</h2>
        <p className="text-sm text-gray-400">
          Convert volume measurements to weight for common ingredients
        </p>
      </div>

      {/* Ingredient Search */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Search Ingredient</label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Type to search..."
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
        />
        {searchQuery && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50">
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map(ing => (
                <button
                  key={ing.name}
                  onClick={() => {
                    setSelectedIngredient(ing);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a]"
                >
                  {ing.name}
                  {ing.packed && <span className="ml-2 text-xs text-gray-400">(packed)</span>}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No ingredients found</div>
            )}
          </div>
        )}
      </div>

      {/* Selected Ingredient */}
      {selectedIngredient && (
        <div className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/10 p-4">
          <div className="font-medium text-white">{selectedIngredient.name}</div>
          {selectedIngredient.notes && (
            <div className="mt-1 text-xs text-gray-400">{selectedIngredient.notes}</div>
          )}
          {selectedIngredient.packed && (
            <div className="mt-1 text-xs text-[#29E7CD]">Use packed measurement</div>
          )}
        </div>
      )}

      {/* Volume Input */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Volume</label>
          <input
            type="number"
            value={volume}
            onChange={e => setVolume(e.target.value)}
            placeholder="Enter volume"
            min="0"
            step="0.1"
            disabled={!selectedIngredient}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Unit</label>
          <select
            value={volumeUnit}
            onChange={e => setVolumeUnit(e.target.value as 'cup' | 'tbsp' | 'tsp' | 'ml')}
            disabled={!selectedIngredient}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:opacity-50"
          >
            {volumeUnits.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weight Result */}
      {weight !== null && selectedIngredient && (
        <div className="rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-6 text-center">
          <div className="text-sm text-gray-400">Weight</div>
          <div className="mt-2 text-4xl font-bold text-[#29E7CD]">{weight.toFixed(1)}g</div>
          <div className="mt-2 text-sm text-gray-400">{(weight / 28.35).toFixed(1)} oz</div>
        </div>
      )}
    </div>
  );
}

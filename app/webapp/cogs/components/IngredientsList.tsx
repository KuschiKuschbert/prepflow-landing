'use client';

import React, { useState } from 'react';
import { COGSCalculation } from '../types';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface IngredientsListProps {
  calculations: COGSCalculation[];
  onUpdateCalculation: (ingredientId: string, newQuantity: number) => void;
  onRemoveCalculation: (ingredientId: string) => void;
}

// Format quantity to show reasonable decimal places
const formatQuantity = (quantity: number): string => {
  // If it's a whole number, show no decimals
  if (Number.isInteger(quantity)) {
    return quantity.toString();
  }

  // For small numbers (< 1), show up to 3 decimal places
  if (quantity < 1) {
    const formatted = quantity.toFixed(3);
    // Remove trailing zeros and decimal point if not needed
    return formatted.replace(/\.?0+$/, '');
  }

  // For larger numbers, show up to 2 decimal places
  const formatted = quantity.toFixed(2);
  // Remove trailing zeros and decimal point if not needed
  return formatted.replace(/\.?0+$/, '');
};

// Format unit to be more readable
const formatUnit = (unit: string): string => {
  if (!unit) return '';

  const unitLower = unit.toLowerCase().trim();

  // Map common unit abbreviations to readable forms
  const unitMap: { [key: string]: string } = {
    'gm': 'g',
    'g': 'g',
    'gram': 'g',
    'grams': 'g',
    'kg': 'kg',
    'kilogram': 'kg',
    'kilograms': 'kg',
    'pc': 'pc',
    'piece': 'pc',
    'pieces': 'pc',
    'ml': 'ml',
    'milliliter': 'ml',
    'milliliters': 'ml',
    'l': 'L',
    'liter': 'L',
    'liters': 'L',
    'litre': 'L',
    'litres': 'L',
    'tsp': 'tsp',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
    'tbsp': 'tbsp',
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'cup': 'cup',
    'cups': 'cup',
    'oz': 'oz',
    'ounce': 'oz',
    'ounces': 'oz',
    'lb': 'lb',
    'pound': 'lb',
    'pounds': 'lb',
  };

  return unitMap[unitLower] || unit;
};

export const IngredientsList: React.FC<IngredientsListProps> = ({
  calculations,
  onUpdateCalculation,
  onRemoveCalculation,
}) => {
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  if (!calculations || calculations.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-[#2a2a2a]/50 bg-[#0a0a0a]/50 p-3">
      <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
        Ingredients ({calculations.length})
      </h4>
      <div className="space-y-1.5">
        {calculations.map((calc, index) => (
          <div
            key={calc.ingredientId || index}
            className="group flex items-center justify-between rounded-lg bg-[#1f1f1f]/50 px-2 py-1.5 text-sm transition-colors hover:bg-[#2a2a2a]/50"
          >
            <span className="text-gray-300">{calc.ingredientName}</span>
            <div className="flex items-center gap-2">
              {editingIngredient === calc.ingredientId ? (
                <>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={e => setEditQuantity(parseFloat(e.target.value) || 0)}
                      className="w-16 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-2 py-1 text-xs text-white focus:border-[#29E7CD] focus:ring-1 focus:ring-[#29E7CD] focus:outline-none"
                      step="0.1"
                      min="0"
                      autoFocus
                    />
                    <span className="text-xs text-gray-400">{formatUnit(calc.unit)}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (editQuantity > 0) {
                        onUpdateCalculation(calc.ingredientId, editQuantity);
                      }
                      setEditingIngredient(null);
                      setEditQuantity(0);
                    }}
                    className="rounded-lg bg-[#29E7CD] p-1 text-white transition-colors hover:bg-[#29E7CD]/80"
                    aria-label="Save"
                  >
                    <Icon icon={Check} size="xs" aria-hidden={true} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingIngredient(null);
                      setEditQuantity(0);
                    }}
                    className="rounded-lg bg-gray-600 p-1 text-white transition-colors hover:bg-gray-500"
                    aria-label="Cancel"
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-400">
                    {formatQuantity(calc.quantity)} {formatUnit(calc.unit)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingIngredient(calc.ingredientId);
                      setEditQuantity(calc.quantity);
                    }}
                    className="rounded-lg p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                    aria-label="Edit quantity"
                  >
                    <Icon icon={Edit} size="xs" aria-hidden={true} />
                  </button>
                  <button
                    onClick={() => onRemoveCalculation(calc.ingredientId)}
                    className="rounded-lg p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
                    aria-label="Remove ingredient"
                  >
                    <Icon icon={Trash2} size="xs" aria-hidden={true} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

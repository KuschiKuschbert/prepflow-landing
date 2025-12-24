'use client';

import { Icon } from '@/components/ui/Icon';
import { Check, Edit, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { COGSCalculation } from '../types';

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
    gm: 'g',
    g: 'g',
    gram: 'g',
    grams: 'g',
    kg: 'kg',
    kilogram: 'kg',
    kilograms: 'kg',
    pc: 'pc',
    piece: 'pc',
    pieces: 'pc',
    ml: 'ml',
    milliliter: 'ml',
    milliliters: 'ml',
    l: 'L',
    liter: 'L',
    liters: 'L',
    litre: 'L',
    litres: 'L',
    tsp: 'tsp',
    teaspoon: 'tsp',
    teaspoons: 'tsp',
    tbsp: 'tbsp',
    tablespoon: 'tbsp',
    tablespoons: 'tbsp',
    cup: 'cup',
    cups: 'cup',
    oz: 'oz',
    ounce: 'oz',
    ounces: 'oz',
    lb: 'lb',
    pound: 'lb',
    pounds: 'lb',
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
    <div className="mt-4 rounded-xl border border-[var(--border)]/50 bg-[var(--background)]/50 p-3">
      <h4 className="mb-2 text-xs font-semibold tracking-wide text-[var(--foreground-muted)] uppercase">
        Ingredients ({calculations.length})
      </h4>
      <div className="space-y-1.5">
        {calculations.map((calc, index) => (
          <div
            key={`${calc.recipeId || 'dish'}-${calc.ingredientId || calc.id || index}`}
            className="group flex items-center justify-between rounded-lg bg-[var(--surface)]/50 px-2 py-1.5 text-sm transition-colors hover:bg-[var(--muted)]/50"
          >
            <span className="text-[var(--foreground-secondary)]">{calc.ingredientName}</span>
            <div className="flex items-center gap-2">
              {editingIngredient === calc.ingredientId ? (
                <>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={e => setEditQuantity(parseFloat(e.target.value) || 0)}
                      className="w-16 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                      step="0.1"
                      min="0"
                      autoFocus
                    />
                    <span className="text-xs text-[var(--foreground-muted)]">
                      {formatUnit(calc.unit)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (editQuantity > 0) {
                        onUpdateCalculation(calc.ingredientId, editQuantity);
                      }
                      setEditingIngredient(null);
                      setEditQuantity(0);
                    }}
                    className="rounded-lg bg-[var(--primary)] p-1 text-[var(--button-active-text)] transition-colors hover:bg-[var(--primary)]/80"
                    aria-label="Save"
                  >
                    <Icon icon={Check} size="xs" aria-hidden={true} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingIngredient(null);
                      setEditQuantity(0);
                    }}
                    className="rounded-lg bg-gray-600 p-1 text-[var(--foreground)] transition-colors hover:bg-gray-500"
                    aria-label="Cancel"
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium text-[var(--foreground-muted)]">
                    {formatQuantity(calc.quantity)} {formatUnit(calc.unit)}
                  </span>
                  <button
                    onClick={() => {
                      setEditingIngredient(calc.ingredientId);
                      setEditQuantity(calc.quantity);
                    }}
                    className="rounded-lg p-1 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                    aria-label="Edit quantity"
                  >
                    <Icon icon={Edit} size="xs" aria-hidden={true} />
                  </button>
                  <button
                    onClick={() => onRemoveCalculation(calc.ingredientId)}
                    className="rounded-lg p-1 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--color-error)]/20 hover:text-[var(--color-error)]"
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

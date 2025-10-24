'use client';

import React from 'react';
import { Recipe } from '../types';

interface RecipeFormProps {
  showForm: boolean;
  newRecipe: Partial<Recipe>;
  onToggleForm: () => void;
  onUpdateRecipe: (updates: Partial<Recipe>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RecipeForm({
  showForm,
  newRecipe,
  onToggleForm,
  onUpdateRecipe,
  onSubmit,
}: RecipeFormProps) {
  if (!showForm) return null;

  return (
    <div className="mb-6 rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
      <h2 className="mb-4 text-lg font-semibold sm:text-xl">Add New Recipe</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Recipe Name *</label>
          <input
            type="text"
            required
            value={newRecipe.name || ''}
            onChange={e => onUpdateRecipe({ name: e.target.value })}
            className="w-full rounded-md border border-[#2a2a2a] px-3 py-2 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="e.g., Chicken Stir-fry"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Yield Portions</label>
          <input
            type="number"
            min="1"
            value={newRecipe.yield || 1}
            onChange={e => onUpdateRecipe({ yield: parseInt(e.target.value) || 1 })}
            className="w-full rounded-md border border-[#2a2a2a] px-3 py-2 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Instructions</label>
          <textarea
            value={newRecipe.instructions || ''}
            onChange={e => onUpdateRecipe({ instructions: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-[#2a2a2a] px-3 py-2 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="Step-by-step cooking instructions..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
          >
            Add Recipe
          </button>
          <button
            type="button"
            onClick={onToggleForm}
            className="rounded-lg bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

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
  onSubmit 
}: RecipeFormProps) {
  if (!showForm) return null;

  return (
    <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Recipe</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Recipe Name *
          </label>
          <input
            type="text"
            required
            value={newRecipe.name || ''}
            onChange={(e) => onUpdateRecipe({ name: e.target.value })}
            className="w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Chicken Stir-fry"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Yield Portions
          </label>
          <input
            type="number"
            min="1"
            value={newRecipe.yield || 1}
            onChange={(e) => onUpdateRecipe({ yield: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Instructions
          </label>
          <textarea
            value={newRecipe.instructions || ''}
            onChange={(e) => onUpdateRecipe({ instructions: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Step-by-step cooking instructions..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Recipe
          </button>
          <button
            type="button"
            onClick={onToggleForm}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

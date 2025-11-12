'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Recipe } from '../types';

interface RecipeComboboxProps {
  recipes: Recipe[];
  selectedRecipe: string;
  onRecipeSelect: (recipeId: string) => void;
  onCreateNew: () => void;
  disabled?: boolean;
}

export function RecipeCombobox({
  recipes,
  selectedRecipe,
  onRecipeSelect,
  onCreateNew,
  disabled = false,
}: RecipeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get selected recipe name
  const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);
  const displayValue = selectedRecipeData?.name || '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredRecipes.length ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex === -1 && filteredRecipes.length === 0) {
        onCreateNew();
      } else if (highlightedIndex >= 0 && highlightedIndex < filteredRecipes.length) {
        onRecipeSelect(filteredRecipes[highlightedIndex].id);
        setIsOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleSelectRecipe = (recipeId: string) => {
    onRecipeSelect(recipeId);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleCreateNew = () => {
    onCreateNew();
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  return (
    <div ref={comboboxRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-300">📚 Recipe</label>
      <div className="relative">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden={true}
          />
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchQuery : displayValue}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Search recipes or create new..."
            className={`w-full rounded-xl border px-10 py-3 pr-10 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:outline-none ${
              disabled
                ? 'cursor-not-allowed border-gray-600 bg-[#1a1a1a] text-gray-500'
                : 'border-[#2a2a2a] bg-[#0a0a0a] text-white focus:border-[#29E7CD] focus:ring-[#29E7CD]'
            }`}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Toggle dropdown"
          >
            <Icon icon={ChevronDown} size="sm" aria-hidden={true} />
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
            {/* Create New Option */}
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex w-full items-center gap-3 rounded-t-xl border-b border-[#2a2a2a] px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7]">
                <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
              </div>
              <div>
                <div className="font-medium text-white">Create New Recipe</div>
                <div className="text-xs text-gray-400">Start a new recipe from scratch</div>
              </div>
            </button>

            {/* Recipe List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredRecipes.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400">
                  {searchQuery ? (
                    <>
                      <p className="mb-2">No recipes found matching "{searchQuery}"</p>
                      <button
                        type="button"
                        onClick={handleCreateNew}
                        className="text-[#29E7CD] hover:underline"
                      >
                        Create "{searchQuery}" as new recipe
                      </button>
                    </>
                  ) : (
                    <p>No recipes available</p>
                  )}
                </div>
              ) : (
                filteredRecipes.map((recipe, index) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => handleSelectRecipe(recipe.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                      index === highlightedIndex || recipe.id === selectedRecipe
                        ? 'bg-[#2a2a2a]'
                        : 'hover:bg-[#2a2a2a]/50'
                    } ${index === filteredRecipes.length - 1 ? 'rounded-b-xl' : ''}`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white">{recipe.name}</div>
                      <div className="text-xs text-gray-400">
                        {recipe.yield} {recipe.yield_unit || 'servings'}
                      </div>
                    </div>
                    {recipe.id === selectedRecipe && (
                      <div className="ml-2 text-[#29E7CD]">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

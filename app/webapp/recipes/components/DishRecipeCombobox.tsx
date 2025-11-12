'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Recipe } from '../types';

interface SelectedRecipe {
  recipe_id: string;
  quantity: number;
  recipe_name?: string;
}

interface DishRecipeComboboxProps {
  recipes: Recipe[];
  selectedRecipe: SelectedRecipe;
  onSelect: (recipe: Recipe) => void;
}

export default function DishRecipeCombobox({
  recipes,
  selectedRecipe,
  onSelect,
}: DishRecipeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedRecipeData = recipes.find(r => r.id === selectedRecipe.recipe_id);
  const displayValue = selectedRecipeData?.name || '';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredRecipes.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredRecipes.length) {
        onSelect(filteredRecipes[highlightedIndex]);
        setIsOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    onSelect(recipe);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  return (
    <div ref={comboboxRef} className="relative flex-1">
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
          placeholder="Search recipes..."
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-10 py-2 pr-10 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-white"
          aria-label="Toggle dropdown"
        >
          <Icon icon={ChevronDown} size="sm" aria-hidden={true} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
          <div className="max-h-64 overflow-y-auto">
            {filteredRecipes.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                {searchQuery
                  ? `No recipes found matching "${searchQuery}"`
                  : 'No recipes available'}
              </div>
            ) : (
              filteredRecipes.map((recipe, index) => (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => handleSelectRecipe(recipe)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                    index === highlightedIndex || recipe.id === selectedRecipe.recipe_id
                      ? 'bg-[#2a2a2a]'
                      : 'hover:bg-[#2a2a2a]/50'
                  } ${index === filteredRecipes.length - 1 ? 'rounded-b-xl' : ''}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">{recipe.name}</div>
                    {recipe.yield && (
                      <div className="text-xs text-gray-400">
                        {recipe.yield} {recipe.yield_unit || 'servings'}
                      </div>
                    )}
                  </div>
                  {recipe.id === selectedRecipe.recipe_id && (
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
  );
}

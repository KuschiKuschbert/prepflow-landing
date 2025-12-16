'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SelectedIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredient_name?: string;
}

interface Ingredient {
  id: string;
  ingredient_name?: string;
  name?: string;
  unit?: string;
}

interface DishIngredientComboboxProps {
  ingredients: Ingredient[];
  selectedIngredient: SelectedIngredient;
  onSelect: (ingredient: Ingredient) => void;
}

export default function DishIngredientCombobox({
  ingredients,
  selectedIngredient,
  onSelect,
}: DishIngredientComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredIngredients = ingredients.filter(ingredient => {
    const name = ingredient.ingredient_name || ingredient.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedIngredientData = ingredients.find(i => i.id === selectedIngredient.ingredient_id);
  const displayValue =
    selectedIngredientData?.ingredient_name ||
    selectedIngredientData?.name ||
    selectedIngredient.ingredient_name ||
    '';

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
      setHighlightedIndex(prev => (prev < filteredIngredients.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredIngredients.length) {
        onSelect(filteredIngredients[highlightedIndex]);
        setIsOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    onSelect(ingredient);
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
          className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
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
          placeholder="Search ingredients..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-10 py-2 pr-10 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          aria-label="Toggle dropdown"
        >
          <Icon icon={ChevronDown} size="sm" aria-hidden={true} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          <div className="max-h-64 overflow-y-auto">
            {filteredIngredients.length === 0 ? (
              <div className="px-4 py-8 text-center text-[var(--foreground-muted)]">
                {searchQuery
                  ? `No ingredients found matching "${searchQuery}"`
                  : 'No ingredients available'}
              </div>
            ) : (
              filteredIngredients.map((ingredient, index) => {
                const name = ingredient.ingredient_name || ingredient.name || 'Unknown';
                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => handleSelectIngredient(ingredient)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                      index === highlightedIndex ||
                      ingredient.id === selectedIngredient.ingredient_id
                        ? 'bg-[var(--muted)]'
                        : 'hover:bg-[var(--muted)]/50'
                    } ${index === filteredIngredients.length - 1 ? 'rounded-b-xl' : ''}`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-[var(--foreground)]">{name}</div>
                      {ingredient.unit && (
                        <div className="text-xs text-[var(--foreground-muted)]">Unit: {ingredient.unit}</div>
                      )}
                    </div>
                    {ingredient.id === selectedIngredient.ingredient_id && (
                      <div className="ml-2 text-[var(--primary)]">
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
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { RecipeSortField } from '../hooks/useRecipeFiltering';
import { RecipeSearchBar } from './RecipeSearchBar';
import { RecipeSortDropdown } from './RecipeSortDropdown';
import { FilterDropdown } from '@/app/webapp/ingredients/components/FilterDropdown';
import { Tag, X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Recipe } from '../types';

interface RecipeFilterBarProps {
  recipes: Recipe[];
  searchTerm: string;
  categoryFilter: string;
  sortField: RecipeSortField;
  sortDirection: 'asc' | 'desc';
  itemsPerPage: number;
  onSearchChange: (term: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onSortChange: (field: RecipeSortField, direction: 'asc' | 'desc') => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function RecipeFilterBar({
  recipes,
  searchTerm,
  categoryFilter,
  sortField,
  sortDirection,
  itemsPerPage,
  onSearchChange,
  onCategoryFilterChange,
  onSortChange,
  onItemsPerPageChange,
}: RecipeFilterBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // Sync local search term with prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Get unique categories from recipes
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    recipes.forEach(recipe => {
      if (recipe.category) {
        categories.add(recipe.category);
      }
    });
    return Array.from(categories).sort();
  }, [recipes]);

  const activeFilterCount = (searchTerm ? 1 : 0) + (categoryFilter ? 1 : 0);

  const handleClearAll = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onCategoryFilterChange('');
  };

  return (
    <div className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 p-3 backdrop-blur-sm">
      {/* Search and Filters */}
      <div className="flex flex-col gap-2 tablet:flex-row tablet:items-center tablet:gap-2">
        <RecipeSearchBar
          searchTerm={localSearchTerm}
          onSearchChange={setLocalSearchTerm}
          onClear={() => {
            setLocalSearchTerm('');
            onSearchChange('');
          }}
        />

        {/* Filter Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {uniqueCategories.length > 0 && (
            <FilterDropdown
              label="Category"
              icon={Tag}
              value={categoryFilter}
              options={uniqueCategories}
              isOpen={showCategoryMenu}
              onToggle={() => {
                setShowCategoryMenu(!showCategoryMenu);
                setShowSortMenu(false);
              }}
              onChange={onCategoryFilterChange}
              activeColor="border-[#D925C7]/50 bg-[#D925C7]/10 text-[#D925C7]"
              activeBg="bg-[#D925C7]/20"
            />
          )}

          <RecipeSortDropdown
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            isOpen={showSortMenu}
            onToggle={() => {
              setShowSortMenu(!showSortMenu);
              setShowCategoryMenu(false);
            }}
            onClose={() => setShowSortMenu(false)}
          />

          {/* Items per page selector */}
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-2 text-sm text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f]"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {(searchTerm || categoryFilter) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/50 bg-[#29E7CD]/10 px-2.5 py-1 text-xs font-medium text-[#29E7CD]">
              Search: {searchTerm}
              <button
                onClick={() => {
                  setLocalSearchTerm('');
                  onSearchChange('');
                }}
                className="hover:text-[#29E7CD]/80"
                aria-label="Clear search"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D925C7]/50 bg-[#D925C7]/10 px-2.5 py-1 text-xs font-medium text-[#D925C7]">
              Category: {categoryFilter}
              <button
                onClick={() => onCategoryFilterChange('')}
                className="hover:text-[#D925C7]/80"
                aria-label="Clear category filter"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

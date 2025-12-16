'use client';
import { useState, useMemo, useEffect } from 'react';
import { RecipeSortField } from '../hooks/useRecipeFiltering';
import { RecipeSearchBar } from './RecipeSearchBar';
import { RecipeSortDropdown } from './RecipeSortDropdown';
import { FilterDropdown } from '@/app/webapp/ingredients/components/FilterDropdown';
import { AllergenFilterDropdown } from './AllergenFilterDropdown';
import { Tag, X, Leaf, Vegan } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Recipe } from '../types';

interface RecipeFilterBarProps {
  recipes: Recipe[];
  searchTerm: string;
  categoryFilter: string;
  excludeAllergens: string[];
  includeAllergens: string[];
  vegetarian: boolean;
  vegan: boolean;
  sortField: RecipeSortField;
  sortDirection: 'asc' | 'desc';
  itemsPerPage: number;
  onSearchChange: (term: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onExcludeAllergensChange: (allergens: string[]) => void;
  onIncludeAllergensChange: (allergens: string[]) => void;
  onVegetarianChange: (vegetarian: boolean) => void;
  onVeganChange: (vegan: boolean) => void;
  onSortChange: (field: RecipeSortField, direction: 'asc' | 'desc') => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function RecipeFilterBar({
  recipes,
  searchTerm,
  categoryFilter,
  excludeAllergens,
  includeAllergens,
  vegetarian,
  vegan,
  sortField,
  sortDirection,
  itemsPerPage,
  onSearchChange,
  onCategoryFilterChange,
  onExcludeAllergensChange,
  onIncludeAllergensChange,
  onVegetarianChange,
  onVeganChange,
  onSortChange,
  onItemsPerPageChange,
}: RecipeFilterBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showExcludeAllergenMenu, setShowExcludeAllergenMenu] = useState(false);
  const [showIncludeAllergenMenu, setShowIncludeAllergenMenu] = useState(false);
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
  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (excludeAllergens.length > 0 ? 1 : 0) +
    (includeAllergens.length > 0 ? 1 : 0) +
    (vegetarian ? 1 : 0) +
    (vegan ? 1 : 0);
  const handleClearAll = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onCategoryFilterChange('');
    onExcludeAllergensChange([]);
    onIncludeAllergensChange([]);
    onVegetarianChange(false);
    onVeganChange(false);
  };
  const closeOtherMenus = (except: string) => {
    if (except !== 'category') setShowCategoryMenu(false);
    if (except !== 'exclude') setShowExcludeAllergenMenu(false);
    if (except !== 'include') setShowIncludeAllergenMenu(false);
    if (except !== 'sort') setShowSortMenu(false);
  };
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 p-3 backdrop-blur-sm">
      <div className="tablet:flex-row tablet:items-center tablet:gap-2 flex flex-col gap-2">
        <RecipeSearchBar
          searchTerm={localSearchTerm}
          onSearchChange={setLocalSearchTerm}
          onClear={() => {
            setLocalSearchTerm('');
            onSearchChange('');
          }}
        />
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
                closeOtherMenus('category');
              }}
              onChange={onCategoryFilterChange}
              activeColor="border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]"
              activeBg="bg-[var(--accent)]/20"
            />
          )}

          <AllergenFilterDropdown
            label="Exclude Allergens"
            selectedAllergens={excludeAllergens}
            onAllergensChange={onExcludeAllergensChange}
            mode="exclude"
            isOpen={showExcludeAllergenMenu}
            onToggle={() => {
              setShowExcludeAllergenMenu(!showExcludeAllergenMenu);
              closeOtherMenus('exclude');
            }}
            activeColor="border-[var(--color-error)]/50 bg-[var(--color-error)]/10 text-[var(--color-error)]"
            activeBg="bg-[var(--color-error)]/20"
          />

          <AllergenFilterDropdown
            label="Include Allergens"
            selectedAllergens={includeAllergens}
            onAllergensChange={onIncludeAllergensChange}
            mode="include"
            isOpen={showIncludeAllergenMenu}
            onToggle={() => {
              setShowIncludeAllergenMenu(!showIncludeAllergenMenu);
              closeOtherMenus('include');
            }}
            activeColor="border-[var(--color-info)]/50 bg-[var(--color-info)]/10 text-[var(--color-info)]"
            activeBg="bg-[var(--color-info)]/20"
          />

          <button
            onClick={() => onVegetarianChange(!vegetarian)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
              vegetarian
                ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                : 'border-[var(--border)] bg-[var(--background)]/80 text-[var(--foreground-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
            }`}
            title="Show only vegetarian recipes"
          >
            <Icon icon={Leaf} size="sm" aria-hidden={true} />
            <span>Vegetarian</span>
          </button>

          <button
            onClick={() => onVeganChange(!vegan)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
              vegan
                ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                : 'border-[var(--border)] bg-[var(--background)]/80 text-[var(--foreground-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
            }`}
            title="Show only vegan recipes"
          >
            <Icon icon={Vegan} size="sm" aria-hidden={true} />
            <span>Vegan</span>
          </button>

          <RecipeSortDropdown
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            isOpen={showSortMenu}
            onToggle={() => {
              setShowSortMenu(!showSortMenu);
              closeOtherMenus('sort');
            }}
            onClose={() => setShowSortMenu(false)}
          />
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-2 text-sm text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)]"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>
      {(searchTerm ||
        categoryFilter ||
        excludeAllergens.length > 0 ||
        includeAllergens.length > 0 ||
        vegetarian ||
        vegan) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
              Search: {searchTerm}
              <button
                onClick={() => {
                  setLocalSearchTerm('');
                  onSearchChange('');
                }}
                className="hover:text-[var(--primary)]/80"
                aria-label="Clear search"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
              Category: {categoryFilter}
              <button
                onClick={() => onCategoryFilterChange('')}
                className="hover:text-[var(--accent)]/80"
                aria-label="Clear category filter"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
          {excludeAllergens.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-error)]">
              Exclude: {excludeAllergens.length} allergen{excludeAllergens.length > 1 ? 's' : ''}
              <button
                onClick={() => onExcludeAllergensChange([])}
                className="hover:text-red-400/80"
                aria-label="Clear exclude allergens filter"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
          {includeAllergens.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-info)]/50 bg-[var(--color-info)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-info)]">
              Include: {includeAllergens.length} allergen{includeAllergens.length > 1 ? 's' : ''}
              <button
                onClick={() => onIncludeAllergensChange([])}
                className="hover:text-blue-400/80"
                aria-label="Clear include allergens filter"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
          {vegetarian && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-success)]/50 bg-[var(--color-success)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-success)]">
              Vegetarian
              <button
                onClick={() => onVegetarianChange(false)}
                className="hover:text-green-400/80"
                aria-label="Clear vegetarian filter"
              >
                <Icon icon={X} size="xs" aria-hidden={true} />
              </button>
            </span>
          )}
          {vegan && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-success)]/50 bg-[var(--color-success)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-success)]">
              Vegan
              <button
                onClick={() => onVeganChange(false)}
                className="hover:text-green-400/80"
                aria-label="Clear vegan filter"
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

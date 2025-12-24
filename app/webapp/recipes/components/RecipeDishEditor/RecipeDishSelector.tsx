'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { BookOpen, UtensilsCrossed, Search, X } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  type: 'recipe' | 'dish';
}

interface RecipeDishSelectorProps {
  allItems: Item[];
  selectedItem: Item | null;
  onSelectItem: (item: Item) => void;
  capitalizeName: (name: string) => string;
}

export function RecipeDishSelector({
  allItems,
  selectedItem,
  onSelectItem,
  capitalizeName,
}: RecipeDishSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return allItems;
    }

    const lowerSearch = searchTerm.toLowerCase().trim();
    return allItems.filter(item => {
      const itemName = item.name.toLowerCase();
      const itemType = item.type.toLowerCase();
      return itemName.includes(lowerSearch) || itemType.includes(lowerSearch);
    });
  }, [allItems, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Select Recipe or Dish</h3>
        {filteredItems.length !== allItems.length && (
          <span className="text-xs text-[var(--foreground-muted)]">
            {filteredItems.length} of {allItems.length}
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
            aria-hidden={true}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search recipes and dishes..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pr-10 pl-10 text-[var(--foreground)] placeholder-gray-500 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
            aria-label="Search recipes and dishes"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Clear search"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="max-h-[calc(100vh-400px)] space-y-2 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-[var(--foreground-muted)]">
            <p className="mb-2">
              {searchTerm
                ? 'No recipes or dishes found matching your search'
                : 'No recipes or dishes found'}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => {
                logger.dev('RecipeDishSelector: Item clicked', { item });
                onSelectItem(item);
              }}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedItem?.id === item.id && selectedItem?.type === item.type
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    icon={item.type === 'recipe' ? BookOpen : UtensilsCrossed}
                    size="md"
                    className={
                      item.type === 'recipe' ? 'text-[var(--color-info)]' : 'text-[var(--primary)]'
                    }
                    aria-hidden={true}
                  />
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {capitalizeName(item.name)}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

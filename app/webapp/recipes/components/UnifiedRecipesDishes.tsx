'use client';

import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { UnifiedItem } from '@/lib/types/recipes';
import { Calculator, ChefHat, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { useUnifiedItems } from '../hooks/useUnifiedItems';
import { COGSCalculatorModal } from './COGSCalculatorModal';

export default function UnifiedRecipesDishes() {
  const { items, loading, error, categories, fetchItems: _fetchItems } = useUnifiedItems();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCOGSModal, setShowCOGSModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
        {error}
      </div>
    );
  }

  // Filter items by selected category
  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter(item => (item.category || 'Uncategorized') === selectedCategory);

  // Group items by category
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, UnifiedItem[]>,
  );

  const handleCalculateCOGS = (item: UnifiedItem) => {
    setSelectedItem(item);
    setShowCOGSModal(true);
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Grouped Items by Category */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-[var(--foreground-muted)]">🍽️</div>
          <h3 className="mb-2 text-lg font-medium text-[var(--foreground)]">No items yet</h3>
          <p className="text-[var(--foreground-subtle)]">
            Create your first recipe or dish to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{category}</h2>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {categoryItems.length} items
                </span>
              </div>

              {/* Items Grid */}
              <div className="tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4">
                {categoryItems.map(item => (
                  <div
                    key={`${item.itemType}-${item.id}`}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={item.itemType === 'recipe' ? ChefHat : UtensilsCrossed}
                          size="sm"
                          className={
                            item.itemType === 'recipe'
                              ? 'text-[var(--primary)]'
                              : 'text-[var(--color-info)]'
                          }
                          aria-hidden={true}
                        />
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {item.itemType === 'recipe' ? item.recipe_name : item.dish_name}
                        </h3>
                      </div>
                      <span className="rounded-full bg-[var(--muted)] px-2 py-1 text-xs text-[var(--foreground-muted)]">
                        {item.itemType === 'recipe' ? 'Recipe' : 'Dish'}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-[var(--foreground-muted)]">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[var(--foreground-subtle)]">
                        {item.itemType === 'recipe' ? (
                          <>
                            Yield: {item.yield} {item.yield_unit}
                          </>
                        ) : (
                          <>Price: ${item.selling_price?.toFixed(2)}</>
                        )}
                      </div>
                      <button
                        onClick={() => handleCalculateCOGS(item)}
                        className="flex items-center gap-1 rounded-lg bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
                      >
                        <Icon icon={Calculator} size="xs" aria-hidden={true} />
                        Calculate COGS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COGS Calculator Modal */}
      <COGSCalculatorModal
        isOpen={showCOGSModal}
        item={selectedItem}
        onClose={() => {
          setShowCOGSModal(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

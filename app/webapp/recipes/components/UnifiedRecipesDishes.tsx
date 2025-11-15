'use client';

import { useState } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, UtensilsCrossed, Calculator } from 'lucide-react';
import { useUnifiedItems } from '../hooks/useUnifiedItems';
import { UnifiedItem } from '../types';
import { COGSCalculatorModal } from './COGSCalculatorModal';

export default function UnifiedRecipesDishes() {
  const { items, loading, error, categories, fetchItems } = useUnifiedItems();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCOGSModal, setShowCOGSModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
        {error}
      </div>
    );
  }

  // Filter items by selected category
  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter(item => item.category === selectedCategory);

  // Group items by category
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
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
          className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
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
          <div className="mb-4 text-6xl text-gray-400">🍽️</div>
          <h3 className="mb-2 text-lg font-medium text-white">No items yet</h3>
          <p className="text-gray-500">Create your first recipe or dish to get started.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                <h2 className="text-xl font-semibold text-white">{category}</h2>
                <span className="text-sm text-gray-400">{categoryItems.length} items</span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 large-desktop:grid-cols-3">
                {categoryItems.map(item => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="group rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={item.type === 'recipe' ? ChefHat : UtensilsCrossed}
                          size="sm"
                          className={item.type === 'recipe' ? 'text-[#29E7CD]' : 'text-[#3B82F6]'}
                          aria-hidden={true}
                        />
                        <h3 className="font-semibold text-white">{item.name}</h3>
                      </div>
                      <span className="rounded-full bg-[#2a2a2a] px-2 py-1 text-xs text-gray-400">
                        {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mb-3 text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {item.type === 'recipe' ? (
                          <>
                            Yield: {item.yield} {item.yield_unit}
                          </>
                        ) : (
                          <>Price: ${item.selling_price?.toFixed(2)}</>
                        )}
                      </div>
                      <button
                        onClick={() => handleCalculateCOGS(item)}
                        className="flex items-center gap-1 rounded-lg bg-[#29E7CD]/10 px-3 py-1.5 text-xs font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
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

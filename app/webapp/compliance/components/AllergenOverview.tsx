/**
 * Allergen Overview Component
 * Displays all dishes/recipes with their allergens for compliance tracking
 */

'use client';

import { useState, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { Search, Filter } from 'lucide-react';

interface AllergenItem {
  id: string;
  name: string;
  description?: string;
  type: 'recipe' | 'dish';
  allergens: string[];
}

export function AllergenOverview() {
  const [items, setItems] = useState<AllergenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<string>('all');
  const [showOnlyWithAllergens, setShowOnlyWithAllergens] = useState(false);

  useEffect(() => {
    fetchAllergenData();
  }, [selectedAllergenFilter]);

  const fetchAllergenData = async () => {
    try {
      setLoading(true);
      let url = '/api/compliance/allergens';
      if (selectedAllergenFilter !== 'all') {
        url += `?exclude_allergen=${selectedAllergenFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items || []);
      } else {
        logger.error('[Allergen Overview] Error fetching data:', data.error);
      }
    } catch (err) {
      logger.error('[Allergen Overview] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter items by search query and allergen filter
  const filteredItems = items.filter(item => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAllergenFilter =
      !showOnlyWithAllergens || (item.allergens && item.allergens.length > 0);

    return matchesSearch && matchesAllergenFilter;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Icon
              icon={Search}
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden={true}
            />
            <input
              type="text"
              placeholder="Search dishes/recipes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            />
          </div>

          {/* Allergen Filter */}
          <div className="relative">
            <Icon
              icon={Filter}
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden={true}
            />
            <select
              value={selectedAllergenFilter}
              onChange={e => setSelectedAllergenFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] pl-10 pr-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="gluten">Gluten-Free</option>
              <option value="milk">Dairy-Free</option>
              <option value="eggs">Egg-Free</option>
              <option value="nuts">Nut-Free</option>
              <option value="soy">Soy-Free</option>
              <option value="fish">Fish-Free</option>
              <option value="shellfish">Shellfish-Free</option>
              <option value="sesame">Sesame-Free</option>
            </select>
          </div>

          {/* Show Only With Allergens Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnlyWithAllergens"
              checked={showOnlyWithAllergens}
              onChange={e => setShowOnlyWithAllergens(e.target.checked)}
              className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
            />
            <label htmlFor="showOnlyWithAllergens" className="text-sm text-gray-300">
              Show only items with allergens
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2a2a2a]">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Allergens
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    {searchQuery || selectedAllergenFilter !== 'all'
                      ? 'No items match your filters'
                      : 'No items found'}
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr
                    key={`${item.type}-${item.id}`}
                    className="transition-colors hover:bg-[#2a2a2a]/20"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      {item.description && (
                        <div className="mt-1 text-xs text-gray-400">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-xs font-medium text-gray-300">
                        {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AllergenDisplay
                        allergens={item.allergens}
                        showEmpty={true}
                        emptyMessage="None"
                        size="sm"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
          <div className="text-sm text-gray-400">Total Items</div>
          <div className="mt-1 text-2xl font-bold text-white">{items.length}</div>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
          <div className="text-sm text-gray-400">Items with Allergens</div>
          <div className="mt-1 text-2xl font-bold text-[#29E7CD]">
            {items.filter(i => i.allergens && i.allergens.length > 0).length}
          </div>
        </div>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
          <div className="text-sm text-gray-400">Filtered Results</div>
          <div className="mt-1 text-2xl font-bold text-white">{filteredItems.length}</div>
        </div>
      </div>
    </div>
  );
}

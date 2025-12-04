'use client';

import { useState, useMemo } from 'react';
import { Ingredient } from '../../../cogs/types';
import { Icon } from '@/components/ui/Icon';
import { Search, Package, Plus, ArrowLeft } from 'lucide-react';

interface ConsumablesListPanelProps {
  consumables: Ingredient[];
  onConsumableClick: (consumable: Ingredient) => void;
  onBack: () => void;
  capitalizeName: (name: string) => string;
}

function ClickableConsumable({
  consumable,
  onTap,
}: {
  consumable: Ingredient;
  onTap: (consumable: Ingredient) => void;
}) {
  return (
    <button
      onClick={() => onTap(consumable)}
      className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-left transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 focus:ring-2 focus:ring-[#29E7CD]/50 focus:outline-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon={Package} size="md" className="text-[#D925C7]" aria-hidden={true} />
          <div>
            <p className="font-medium text-white">{consumable.ingredient_name}</p>
            <p className="text-xs text-gray-400">
              {consumable.cost_per_unit ? `$${consumable.cost_per_unit.toFixed(2)}` : 'No price'}/
              {consumable.unit || 'unit'}
            </p>
          </div>
        </div>
        <Icon icon={Plus} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
    </button>
  );
}

export function ConsumablesListPanel({
  consumables,
  onConsumableClick,
  onBack,
  capitalizeName,
}: ConsumablesListPanelProps) {
  const [consumableSearch, setConsumableSearch] = useState('');

  const filteredConsumables = useMemo(() => {
    if (!consumableSearch.trim()) return consumables;
    const searchLower = consumableSearch.toLowerCase();
    return consumables.filter(cons => cons.ingredient_name.toLowerCase().includes(searchLower));
  }, [consumables, consumableSearch]);

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Back to recipes/dishes"
        >
          <Icon icon={ArrowLeft} size="sm" aria-hidden={true} />
        </button>
        <h3 className="text-lg font-semibold text-white">Add Consumables</h3>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder="Search consumables..."
            value={consumableSearch}
            onChange={e => setConsumableSearch(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-1 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>
      </div>

      {/* Consumables List */}
      <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto">
        {filteredConsumables.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-gray-400">
            <p>
              {consumableSearch
                ? 'No consumables found'
                : 'No consumables available. Set ingredient category to "Consumables" to add them here.'}
            </p>
          </div>
        ) : (
          filteredConsumables.map(consumable => (
            <ClickableConsumable
              key={consumable.id}
              consumable={consumable}
              onTap={onConsumableClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

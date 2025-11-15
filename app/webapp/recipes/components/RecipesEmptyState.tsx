'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, Plus } from 'lucide-react';

export function RecipesEmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={ChefHat} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">No recipes yet</h3>
      <p className="mb-6 text-gray-400">
        Start by adding your first recipe to begin managing your kitchen costs and optimizing profitability.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href="/webapp/cogs"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
        >
          <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
          Add Your First Recipe
        </a>
      </div>
    </div>
  );
}

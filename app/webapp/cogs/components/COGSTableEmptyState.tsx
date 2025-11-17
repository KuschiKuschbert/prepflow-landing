'use client';

import { Icon } from '@/components/ui/Icon';
import { Utensils } from 'lucide-react';

export function COGSTableEmptyState() {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={Utensils} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">No Ingredients Added Yet</h3>
      <p className="mb-4 text-gray-400">
        Start by adding ingredients to your dish. Each ingredient you add will show its cost, and
        we&apos;ll calculate the total COGS (Cost of Goods Sold) for your recipe.
      </p>
      <p className="text-sm text-gray-500">
        Use the ingredient search above to add ingredients from your database, or add new ones on
        the fly.
      </p>
    </div>
  );
}

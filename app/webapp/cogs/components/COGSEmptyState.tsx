'use client';

import { BarChart3 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export function COGSEmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 flex justify-center">
        <Icon icon={BarChart3} size="xl" className="text-gray-400" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-lg font-medium text-white">Select a Recipe</h3>
      <p className="text-gray-500">
        Choose or create a recipe to see cost analysis and pricing calculations.
      </p>
    </div>
  );
}

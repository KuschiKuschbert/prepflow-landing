'use client';

import { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChefHat } from 'lucide-react';

interface DishDropZoneProps {
  children: ReactNode;
  hasIngredients: boolean;
}

export default function DishDropZone({ children, hasIngredients }: DishDropZoneProps) {
  return (
    <div className="space-y-6">
      {!hasIngredients && (
        <div className="mb-4 rounded-xl border-2 border-dashed border-[#29E7CD]/30 bg-gradient-to-br from-[#1f1f1f] to-[#1f1f1f]/50 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={ChefHat} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-white">Start Building Your Dish</h3>
          <p className="mb-4 text-sm text-gray-300">Choose from the left panel to get started:</p>
          <div className="mx-auto max-w-md space-y-2 text-left text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#29E7CD]/20 font-semibold text-[#29E7CD]">
                1
              </span>
              <div>
                <span className="font-medium text-gray-300">Tap a recipe</span> to add all its
                ingredients at once
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#29E7CD]/20 font-semibold text-[#29E7CD]">
                2
              </span>
              <div>
                <span className="font-medium text-gray-300">Tap an ingredient</span> to add it
                individually (you&apos;ll set the quantity)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#29E7CD]/20 font-semibold text-[#29E7CD]">
                3
              </span>
              <div>
                <span className="font-medium text-gray-300">COGS and pricing</span> calculate
                automatically as you add ingredients
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { UnifiedItem } from '../types';
import { CalculatorTab } from './CalculatorTab';

interface COGSCalculatorModalProps {
  isOpen: boolean;
  item: UnifiedItem | null;
  onClose: () => void;
}

export function COGSCalculatorModal({ isOpen, item, onClose }: COGSCalculatorModalProps) {
  const [initialRecipeId, setInitialRecipeId] = useState<string>('');

  // Pre-select the recipe when modal opens
  useEffect(() => {
    if (isOpen && item) {
      if (item.type === 'recipe') {
        // For recipes, use the recipe ID directly
        setInitialRecipeId(item.id);
      } else {
        // For dishes, we would need to fetch dish details to get associated recipes
        // For now, start with empty selection - user can select recipe manually
        setInitialRecipeId('');
      }
    } else {
      setInitialRecipeId('');
    }
  }, [isOpen, item]);

  if (!isOpen || !item) {
    return null;
  }

  // Note: CalculatorTab doesn't accept props, so we'll need to modify it
  // or create a wrapper component. For now, this opens the calculator
  // and the user can manually select the recipe if needed.

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">COGS Calculator</h2>
            <p className="mt-1 text-sm text-gray-400">
              {item.name} ({item.type === 'recipe' ? 'Recipe' : 'Dish'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close modal"
          >
            <Icon icon={X} size="lg" aria-hidden={true} />
          </button>
        </div>

        {/* Modal Content - Reuse CalculatorTab */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          <CalculatorTab />
        </div>
      </div>
    </div>
  );
}

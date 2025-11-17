'use client';

import { Icon } from '@/components/ui/Icon';
import { Grid3x3, Table2 } from 'lucide-react';

interface EquipmentViewToggleProps {
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export function EquipmentViewToggle({ viewMode, onViewModeChange }: EquipmentViewToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
          viewMode === 'table'
            ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
            : 'text-gray-400 hover:text-white'
        }`}
        title="Table View"
      >
        <Icon icon={Table2} size="sm" aria-hidden={true} />
        <span className="tablet:inline hidden">Table</span>
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
          viewMode === 'cards'
            ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
            : 'text-gray-400 hover:text-white'
        }`}
        title="Card View"
      >
        <Icon icon={Grid3x3} size="sm" aria-hidden={true} />
        <span className="tablet:inline hidden">Cards</span>
      </button>
    </div>
  );
}


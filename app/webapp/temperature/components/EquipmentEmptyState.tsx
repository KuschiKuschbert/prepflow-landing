'use client';

import { Icon } from '@/components/ui/Icon';
import { Thermometer } from 'lucide-react';

interface EquipmentEmptyStateProps {
  onAddEquipment: () => void;
}

export function EquipmentEmptyState({ onAddEquipment }: EquipmentEmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-8 text-center shadow-2xl">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-xl">
        <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
      <h3 className="mb-3 text-2xl font-bold text-white">No Equipment Added</h3>
      <p className="mb-6 max-w-md text-base text-gray-400">
        Add temperature monitoring equipment to start tracking temperatures and ensure food safety compliance
      </p>
      <button
        onClick={onAddEquipment}
        className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <span className="text-xl">➕</span>
        <span>Add Your First Equipment</span>
      </button>
    </div>
  );
}

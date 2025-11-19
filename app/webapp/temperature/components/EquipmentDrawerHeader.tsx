'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { TemperatureEquipment } from '../types';

interface EquipmentDrawerHeaderProps {
  equipment: TemperatureEquipment;
  isMobile: boolean;
  onClose: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  getTypeIcon: (type: string) => string;
  getTypeLabel: (type: string) => string;
}

export function EquipmentDrawerHeader({
  equipment,
  isMobile,
  onClose,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  getTypeIcon,
  getTypeLabel,
}: EquipmentDrawerHeaderProps) {
  return (
    <div
      className={`flex flex-shrink-0 flex-col border-b border-[#2a2a2a] bg-[#0a0a0a] ${
        isMobile ? 'touch-none' : 'large-desktop:touch-auto'
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Swipe indicator for mobile */}
      {isMobile && (
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#2a2a2a]" aria-hidden="true" />
      )}

      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
            <span className="text-2xl">{getTypeIcon(equipment.equipment_type)}</span>
          </div>
          <div>
            <h2 id="equipment-detail-title" className="text-xl font-bold text-white">
              {equipment.name}
            </h2>
            <p className="text-sm text-gray-400">{getTypeLabel(equipment.equipment_type)}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-[#3a3a3a] hover:text-white active:scale-95"
          aria-label="Close drawer"
          title="Close"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}


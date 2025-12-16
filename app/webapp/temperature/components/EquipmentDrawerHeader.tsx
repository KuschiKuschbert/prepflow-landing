'use client';

import { Icon } from '@/components/ui/Icon';
import { X, LucideIcon } from 'lucide-react';
import { TemperatureEquipment } from '../types';

interface EquipmentDrawerHeaderProps {
  equipment: TemperatureEquipment;
  isMobile: boolean;
  onClose: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  getTypeIcon: (type: string) => LucideIcon;
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
      className={`flex flex-shrink-0 flex-col border-b border-[var(--border)] bg-[var(--background)] ${
        isMobile ? 'touch-none' : 'large-desktop:touch-auto'
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Swipe indicator for mobile */}
      {isMobile && (
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[var(--muted)]" aria-hidden={true} />
      )}

      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon
              icon={getTypeIcon(equipment.equipment_type)}
              size="lg"
              className="text-[var(--primary)]"
              aria-hidden={true}
            />
          </div>
          <div>
            <h2 id="equipment-detail-title" className="text-xl font-bold text-[var(--foreground)]">
              {equipment.name}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">{getTypeLabel(equipment.equipment_type)}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--foreground-muted)] transition-all duration-200 hover:scale-110 hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)] active:scale-95"
          aria-label="Close drawer"
          title="Close"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}

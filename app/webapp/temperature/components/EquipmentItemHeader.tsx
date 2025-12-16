'use client';

import { Icon } from '@/components/ui/Icon';
import { LucideIcon, MapPin } from 'lucide-react';

interface EquipmentItemHeaderProps {
  name: string;
  equipmentType: string;
  location: string | null;
  typeIcon: LucideIcon;
  typeLabel: string;
}

export function EquipmentItemHeader({
  name,
  equipmentType,
  location,
  typeIcon,
  typeLabel,
}: EquipmentItemHeaderProps) {
  return (
    <div className="tablet:flex-row tablet:items-start tablet:justify-between mb-6 flex flex-col gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 shadow-lg">
          <Icon icon={typeIcon} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-xl font-bold text-[var(--foreground)]">{name}</h3>
          <p className="mb-2 text-sm font-medium text-[var(--foreground-muted)]">{typeLabel}</p>
          {location && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-subtle)]">
              <Icon icon={MapPin} size="sm" className="text-[var(--foreground-subtle)]" aria-hidden={true} />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Icon } from '@/components/ui/Icon';
import { Copy, QrCode } from 'lucide-react';

interface EquipmentQRCodeModalHeaderProps {
  equipment: {
    name: string;
    equipment_type: string;
    location: string | null;
    min_temp_celsius?: number | null;
    max_temp_celsius?: number | null;
  };
  getTypeLabel: (type: string) => string;
  copied: boolean;
  onCopyId: () => void;
}

export function EquipmentQRCodeModalHeader({
  equipment,
  getTypeLabel,
  copied,
  onCopyId,
}: EquipmentQRCodeModalHeaderProps) {
  return (
    <div className="relative z-10 mb-3 flex-shrink-0">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
          <Icon icon={QrCode} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="qr-code-title" className="truncate text-lg font-bold text-[var(--foreground)]">
            {equipment.name}
          </h2>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-[var(--foreground-muted)]">{getTypeLabel(equipment.equipment_type)}</span>
            {equipment.location && (
              <span className="text-xs text-[var(--foreground-subtle)]">• {equipment.location}</span>
            )}
          </div>
        </div>
        <button
          onClick={onCopyId}
          className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-xs font-medium text-[var(--foreground-muted)] transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--surface-variant)] hover:text-[var(--primary)]"
          title="Copy Equipment ID"
        >
          <Icon icon={Copy} size="xs" aria-hidden={true} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Temperature Range */}
      {(equipment.min_temp_celsius !== null || equipment.max_temp_celsius !== null) && (
        <div className="ml-10 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2 py-1">
          <span className="text-xs font-semibold text-[var(--primary)]">
            {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null
              ? `${equipment.min_temp_celsius}°C - ${equipment.max_temp_celsius}°C`
              : equipment.min_temp_celsius !== null
                ? `≥${equipment.min_temp_celsius}°C`
                : `≤${equipment.max_temp_celsius}°C`}
          </span>
        </div>
      )}

      {/* Permanent Link Note */}
      <div className="mt-1.5 ml-10 rounded-lg border border-[var(--primary)]/20 bg-[var(--muted)]/50 px-2 py-1">
        <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
          <span className="font-semibold text-[var(--primary)]">Permanently linked</span> — This QR code is
          like a well-seasoned pan: it&apos;ll stick around even if you rename the equipment. No
          reprinting needed!
        </p>
      </div>
    </div>
  );
}

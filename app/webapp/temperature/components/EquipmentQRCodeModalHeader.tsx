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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={QrCode} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="qr-code-title" className="truncate text-lg font-bold text-white">
            {equipment.name}
          </h2>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-gray-400">{getTypeLabel(equipment.equipment_type)}</span>
            {equipment.location && (
              <span className="text-xs text-gray-500">• {equipment.location}</span>
            )}
          </div>
        </div>
        <button
          onClick={onCopyId}
          className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-2 py-1 text-xs font-medium text-gray-400 transition-all hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a] hover:text-[#29E7CD]"
          title="Copy Equipment ID"
        >
          <Icon icon={Copy} size="xs" aria-hidden={true} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Temperature Range */}
      {(equipment.min_temp_celsius !== null || equipment.max_temp_celsius !== null) && (
        <div className="ml-10 rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-2 py-1">
          <span className="text-xs font-semibold text-[#29E7CD]">
            {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null
              ? `${equipment.min_temp_celsius}°C - ${equipment.max_temp_celsius}°C`
              : equipment.min_temp_celsius !== null
                ? `≥${equipment.min_temp_celsius}°C`
                : `≤${equipment.max_temp_celsius}°C`}
          </span>
        </div>
      )}

      {/* Permanent Link Note */}
      <div className="ml-10 mt-1.5 rounded-lg border border-[#29E7CD]/20 bg-[#2a2a2a]/50 px-2 py-1">
        <p className="text-xs leading-relaxed text-gray-400">
          <span className="font-semibold text-[#29E7CD]">Permanently linked</span> — This QR code
          is like a well-seasoned pan: it&apos;ll stick around even if you rename the equipment. No
          reprinting needed!
        </p>
      </div>
    </div>
  );
}

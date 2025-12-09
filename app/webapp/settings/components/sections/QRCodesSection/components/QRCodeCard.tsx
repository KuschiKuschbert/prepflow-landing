import { Icon } from '@/components/ui/Icon';
import { Check } from 'lucide-react';
import QRCodeSVG from 'react-qr-code';
import type { QRCodeEntity } from '../types';

interface QRCodeCardProps {
  entity: QRCodeEntity;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * QR code card component
 */
export function QRCodeCard({ entity, isSelected, onToggle }: QRCodeCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer rounded-xl border p-2 select-none ${
        isSelected
          ? 'border-[#29E7CD] bg-[#29E7CD]/10'
          : 'border-[#2a2a2a] bg-[#1f1f1f] hover:border-[#3a3a3a]'
      }`}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full ${
          isSelected ? 'bg-[#29E7CD]' : 'border border-gray-600 bg-[#2a2a2a]'
        }`}
      >
        {isSelected && <Icon icon={Check} size="xs" className="text-black" />}
      </div>

      {/* QR Code */}
      <div className="mb-1.5 flex justify-center rounded-lg bg-white p-1.5">
        <QRCodeSVG
          value={entity.destinationUrl}
          size={48}
          level="M"
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <div className="truncate text-[10px] font-medium text-white" title={entity.name}>
          {entity.name}
        </div>
        {entity.subtitle && (
          <div className="truncate text-[8px] text-gray-500">{entity.subtitle}</div>
        )}
      </div>
    </div>
  );
}

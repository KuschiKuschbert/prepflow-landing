'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useQRCodeModalEffects } from '../hooks/useQRCodeModalEffects';
import { EquipmentQRCodeModalHeader } from './EquipmentQRCodeModalHeader';
import { EquipmentQRCodeDisplay } from './EquipmentQRCodeDisplay';
import { EquipmentQRCodeModalActions } from './EquipmentQRCodeModalActions';

interface EquipmentQRCodeModalProps {
  equipment: {
    id: string;
    name: string;
    equipment_type: string;
    location: string | null;
    min_temp_celsius?: number | null;
    max_temp_celsius?: number | null;
  };
  isOpen: boolean;
  onClose: () => void;
  temperatureTypes?: Array<{ value: string; label: string; icon: string }>;
}

export function EquipmentQRCodeModal({
  equipment,
  isOpen,
  onClose,
  temperatureTypes = [],
}: EquipmentQRCodeModalProps) {
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Get base URL from window location
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, [equipment.id]);

  useQRCodeModalEffects({
    isOpen,
    onClose,
    modalRef,
    closeButtonRef,
  });

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(equipment.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Use baseUrl if available, otherwise use a placeholder that will update
  const equipmentUrl = baseUrl
    ? `${baseUrl}/webapp/equipment/${equipment.id}`
    : `/webapp/equipment/${equipment.id}`;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-code-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[95vh] rounded-2xl bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] border border-[#2a2a2a] shadow-2xl p-3 tablet:p-4 desktop:max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient accent */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#29E7CD]/10 via-transparent to-[#D925C7]/10 opacity-50 pointer-events-none" />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] backdrop-blur-sm transition-all hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
          aria-label="Close QR code modal"
        >
          <Icon icon={X} size="sm" className="text-gray-400" />
        </button>

        <EquipmentQRCodeModalHeader
          equipment={equipment}
          getTypeLabel={getTypeLabel}
          copied={copied}
          onCopyId={handleCopyId}
        />

        <EquipmentQRCodeDisplay equipmentUrl={equipmentUrl} baseUrl={baseUrl} printRef={printRef} />

        <EquipmentQRCodeModalActions
          printRef={printRef}
          equipment={equipment}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
